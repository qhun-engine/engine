import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { Injector } from "../../../src/engine/di/Injector";
import { Injectable } from "../../../src/engine/di/Injectable";
import { InjectorError } from "../../../src/engine/exception/InjectorError";

@suite("engine/di/Injector") class InjectorSpec {

    @test "Injector.getInstance() is working"() {

        expect(typeof Injector.getInstance).to.equal("function");
        expect(Injector.getInstance()).to.be.an.instanceOf(Injector);
    }

    @test "Can instantiate a class"() {

        @Injectable()
        class Test { }

        expect(Injector.getInstance().instantiateClass(Test)).to.be.an.instanceOf(Test);
    }

    @test "Must reject a class that is not @Injectable"() {

        class Test { }

        expect(() => {
            Injector.getInstance().instantiateClass(Test);
        }).to.throw(InjectorError);
    }

    @test "Must resolve delcared dependencies"() {

        @Injectable()
        class Dependency { }

        @Injectable()
        class Test {
            constructor(
                public dep: Dependency
            ) { }
        }

        expect(Injector.getInstance().instantiateClass(Test).dep).to.be.an.instanceOf(Dependency);
    }

    @test "Can resolve neasted dependencies"() {

        @Injectable()
        class Dependency { }

        @Injectable()
        class MidDependency {
            constructor(
                public dep: Dependency
            ) { }
        }

        @Injectable()
        class Test {
            constructor(
                public dep: MidDependency
            ) { }
        }

        const instance = Injector.getInstance().instantiateClass(Test);
        expect(instance.dep).to.be.an.instanceOf(MidDependency);
        expect(instance.dep.dep).to.be.an.instanceOf(Dependency);
    }
}