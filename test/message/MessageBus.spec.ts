import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { MessageBus } from "../../src/message/MessageBus";
import { BroadcastMessageBase } from "../../src/message/impl/BroadcastMessageBase";
import { TargetedMessageBase } from "../../src/message/impl/TargetedMessageBase";
import { Injector, Subscription } from "@qhun-engine/base";
import { MessageType } from "../../src/message/MessageType";
import { InternalMessageBus } from "../../src/message/InternalMessageBus";
import { CanHandleMessages } from "../../src/constraint/CanHandleMessages";
import { Message } from "../../src/message/Message";

@suite("message/MessageBus") class RectangleSpec {

    before() {

        // empty the message bus queue and observers
        const mb = Injector.get(InternalMessageBus);
        (mb as any).queue = {};
        (mb as any).observers = {};
    }

    @test "Is @Injectable"() {

        expect(Injector.get(MessageBus)).to.be.an.instanceOf(MessageBus);
    }

    @test "Can queue messages"() {

        class TestMessage extends BroadcastMessageBase<string> {

            type = MessageType.Engine;
        }

        const mb = Injector.get(MessageBus);
        mb.send(new TestMessage("testData"));

        expect(mb.getQueueSize()).to.equal(1);
    }

    @test "Can dispatch and receive broadcast messages"(done: Function) {

        class TestMessage extends BroadcastMessageBase<string> {

            type = MessageType.Engine;
        }

        const mb = Injector.get(MessageBus);
        const testMessageInstance = new TestMessage("testData");
        mb.send(testMessageInstance);

        // observe for engine type messages
        mb.observe(MessageType.Engine).subscribe(message => {

            expect(message).to.equal(testMessageInstance);
            done();
        });

        // dispatch and wait for the observable to get the result
        Injector.get(InternalMessageBus).dispatch();
    }

    @test "Can dispatch and receive targeted messages"(done: Function) {

        class TestMessage extends TargetedMessageBase<string> {

            type = MessageType.Engine;
        }
        class TestReceiver implements CanHandleMessages {

            handleMessage(message: Message): void {

                expect(message).to.equal(messageInst);

                // test payload
                expect(message.getData()).to.equal("hello world");

                done();
            }
        }

        const receiverInst = new TestReceiver();
        const messageInst = new TestMessage(receiverInst, "hello world");

        const mb = Injector.get(MessageBus);
        mb.send(messageInst);

        // dispatch the queue
        Injector.get(InternalMessageBus).dispatch();
    }

    @test "Subscription handleing is correct"() {

        const mb = Injector.get(MessageBus);
        const subscription = mb.observe(MessageType.Engine).subscribe(() => { });

        expect(subscription).to.be.an.instanceOf(Subscription);
        expect((Injector.get(InternalMessageBus) as any).observers[MessageType.Engine].length).to.equal(1);

        // unsubscribe
        subscription.unsubscribe();

        // observer should be removed
        expect((Injector.get(InternalMessageBus) as any).observers[MessageType.Engine].length).to.equal(0);
    }

    @test "Queue size calculations are correct"() {

        class Test1 extends BroadcastMessageBase {
            type = MessageType.Engine
        };
        class Test2 extends BroadcastMessageBase {
            type = MessageType.Engine
        };
        class Test3 extends BroadcastMessageBase {
            type = MessageType.Audio
        };

        const inst1 = new Test1("hello");
        const inst2 = new Test2("world");
        const inst3 = new Test3("123test");

        // send all messages
        const mb = Injector.get(MessageBus);
        mb.send(inst1);
        mb.send(inst2);
        mb.send(inst3);

        // get queue size
        expect(mb.getQueueSize()).to.equal(3);
        expect(mb.getQueueSize(MessageType.Engine)).to.equal(2);
        expect(mb.getQueueSize(MessageType.Audio)).to.equal(1);

        // dispatch
        Injector.get(InternalMessageBus).dispatch();

        // queue must be empty
        expect(mb.getQueueSize()).to.equal(0);
    }
}