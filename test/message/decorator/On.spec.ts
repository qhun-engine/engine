import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { On } from "../../../src/message/decorator/On";
import { BroadcastMessageBase } from "../../../src/message/impl/BroadcastMessageBase";
import { MessageType } from "../../../src/message/MessageType";
import { Injector, Singleton, ConstraintError } from "@qhun-engine/base";
import { MessageBus } from "../../../src/message/MessageBus";
import { InternalMessageBus } from "../../../src/message/InternalMessageBus";

@suite("message/decorator/On") class OnSpec {

    before() {

        // empty the message bus queue and observers
        const mb = Injector.get(InternalMessageBus);
        (mb as any).queue = {};
        (mb as any).observers = {};
    }

    @test "Can observe the MessageBus"(done: Function) {

        class TestMessage extends BroadcastMessageBase {
            type = MessageType.Engine;
        }
        class TestMessage2 extends BroadcastMessageBase {
            type = MessageType.Engine;
        }

        const message1 = new TestMessage("test");
        const message2 = new TestMessage2("test");
        let calledFlag = false;

        @Singleton()
        class OnImplStub {

            @On(MessageType.Engine, TestMessage)
            private test(message: TestMessage): void {

                calledFlag = true;

                expect(message).to.equal(message1);
                done();
            }
        }

        const mb = Injector.get(MessageBus);

        // first send the second message (other class)
        mb.send(message2);
        mb.send(message1);

        // dispatch
        Injector.get(InternalMessageBus).dispatch();

        // the first send must be ignored because the impl stub class has no instance
        expect(calledFlag).to.equal(false);

        // redo the send process
        new OnImplStub();

        // first send the second message (other class)
        mb.send(message2);
        mb.send(message1);

        // dispatch
        Injector.get(InternalMessageBus).dispatch();
    }

    @test "Must error when placing on a class that is not a @Singleton"() {

        expect(() => {

            class TestMessage extends BroadcastMessageBase {
                type = MessageType.Engine;
            }

            class OnImplStub {

                @On(MessageType.Engine, TestMessage)
                private test(message: TestMessage): void {

                }
            }

            const mb = Injector.get(MessageBus);
            mb.send(new TestMessage("test"));
            Injector.get(InternalMessageBus).dispatch();

        }).to.throw(ConstraintError);
    }
}