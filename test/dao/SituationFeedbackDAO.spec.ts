// tslint:disable-next-line:one-variable-per-declaration
declare const await, describe, beforeEach, it, xit, expect, jest;

import { Client } from '../../src/Client';

import { OnmsAuthConfig } from '../../src/api/OnmsAuthConfig';
import { OnmsServer } from '../../src/api/OnmsServer';

import { SituationFeedbackDAO } from '../../src/dao/SituationFeedbackDAO';

import { OnmsSituationFeedback } from '../../src/model/OnmsSituationFeedback';

import { MockHTTP23 } from '../rest/MockHTTP23';
import { MockHTTP24 } from '../rest/MockHTTP24';
import { OnmsSituationFeedbackType, FeedbackTypes } from '../../src/model/OnmsSituationFeedbackType';

const SERVER_NAME = 'Demo';
const SERVER_URL = 'http://demo.opennms.org/opennms/';
const SERVER_USER = 'demo';
const SERVER_PASSWORD = 'demo';

// tslint:disable-next-line:one-variable-per-declaration
let opennms: Client, server, auth, mockHTTP, dao: SituationFeedbackDAO;

describe('SituationfeedbackDAO via 23', () => {
    beforeEach((done) => {
        auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
        const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
        server = builder.build();
        mockHTTP = new MockHTTP23(server);
        opennms = new Client(mockHTTP);
        dao = new SituationFeedbackDAO(mockHTTP);
        Client.getMetadata(server, mockHTTP).then((metadata) => {
            server = builder.setMetadata(metadata).build();
            mockHTTP.server = server;
            done();
        });
    });
    it('SituationFeedbackDAO.get(210)', () => {
        return dao.getFeedback(210).then((feedback) => {
            expect(feedback).toHaveLength(4);
            expect(feedback[0].alarmKey).toEqual('uei.opennms.org/alarms/trigger:localhost:0.0.0.0:FEEDBACK_C');
            expect(feedback[0].fingerprint).toEqual('NDg3ZjdiMjJmNjgzMTJkMmMxYmJjOTNiMWFlYTQ0NWI=');
            expect(feedback[0].feedbackType).toEqual(OnmsSituationFeedbackType.forId('CORRECT'));
            expect(feedback[0].reason).toEqual('ALL_CORRECT');
            expect(feedback[0].user).toEqual('admin');
            expect(feedback[0].timestamp).toEqual(1533835399918);
            expect(feedback[0].rootCause).toEqual(undefined);
            expect(feedback[0].tags).toEqual(undefined);
        });
    });
    it('SituationFeedbackDAO.serializeFeedback()', () => {
        const feedback = new OnmsSituationFeedback();
        feedback.alarmKey = 'some-key';
        feedback.fingerprint = 'hash#';
        feedback.feedbackType = FeedbackTypes.CORRECT;
        const serializeFeedback = dao.serializeFeedback([feedback]);
        expect(serializeFeedback[0].feedbackType).toEqual('CORRECT');
        // Original entry should be unchanged
        expect(feedback.feedbackType).toEqual(FeedbackTypes.CORRECT);
        expect(JSON.stringify(serializeFeedback)).toEqual(
            '[{"alarmKey":"some-key","fingerprint":"hash#","feedbackType":"CORRECT"}]');
    });
});

describe('SituationfeedbackDAO via 24', () => {
    beforeEach((done) => {
        auth = new OnmsAuthConfig(SERVER_USER, SERVER_PASSWORD);
        const builder = OnmsServer.newBuilder(SERVER_URL).setName(SERVER_NAME).setAuth(auth);
        server = builder.build();
        mockHTTP = new MockHTTP24(server);
        opennms = new Client(mockHTTP);
        dao = new SituationFeedbackDAO(mockHTTP);
        Client.getMetadata(server, mockHTTP).then((metadata) => {
            server = builder.setMetadata(metadata).build();
            mockHTTP = server;
            done();
        });
    });
    it('SituationFeedbackDAO.get(616)', () => {
        return dao.getFeedback(616).then((feedback) => {
            expect(feedback).toHaveLength(9);
            expect(feedback[0].alarmKey).toEqual('uei.opennms.org/alarms/trigger:localhost:0.0.0.0:ALARM_C');
            expect(feedback[0].fingerprint).toEqual('NDg3ZjdiMjJmNjgzMTJkMmMxYmJjOTNiMWFlYTQ0NWI=');
            expect(feedback[0].feedbackType).toEqual(OnmsSituationFeedbackType.forId('CORRECT'));
            expect(feedback[0].reason).toEqual(null);
            expect(feedback[0].user).toEqual('admin');
            expect(feedback[0].timestamp).toEqual(1553886888758);
            expect(feedback[0].rootCause).toEqual(false);
            expect(feedback[0].tags).toHaveLength(8);
            expect(feedback[0].tags[0]).toEqual('banana');
        });
    });
    it('SituationFeedbackDAO.getTags("ba")', () => {
        return dao.getTags('ba').then((tags) => {
            expect(tags).toHaveLength(4);
            expect(tags[0]).toEqual('ball');
        });
    });
    it('SituationFeedbackDAO.serializeFeedback()', () => {
        const feedback = new OnmsSituationFeedback();
        feedback.alarmKey = 'some-key';
        feedback.fingerprint = 'hash#';
        feedback.feedbackType = FeedbackTypes.CORRECT;
        const serializeFeedback = dao.serializeFeedback([feedback]);
        expect(serializeFeedback[0].feedbackType).toEqual('CORRECT');
        // Original entry should be unchanged
        expect(feedback.feedbackType).toEqual(FeedbackTypes.CORRECT);
        expect(JSON.stringify(serializeFeedback)).toEqual(
            '[{"alarmKey":"some-key","fingerprint":"hash#","feedbackType":"CORRECT"}]');
    });
    it('SituationFeedbackDAO.serializeTags()', () => {
        const feedback = new OnmsSituationFeedback();
        feedback.alarmKey = 'some-key';
        feedback.fingerprint = 'hash#';
        feedback.feedbackType = FeedbackTypes.CORRECT;
        const serializeFeedback = dao.serializeFeedback([feedback]);
        expect(serializeFeedback[0].feedbackType).toEqual('CORRECT');
        // Original entry should be unchanged
        expect(feedback.feedbackType).toEqual(FeedbackTypes.CORRECT);
        expect(JSON.stringify(serializeFeedback)).toEqual(
            '[{"alarmKey":"some-key","fingerprint":"hash#","feedbackType":"CORRECT"}]');
    });
});
