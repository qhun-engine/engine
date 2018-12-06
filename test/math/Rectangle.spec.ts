import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { Rectangle } from "../../src/math/Rectangle";

@suite("math/Rectangle") class RectangleSpec {

    @test "Must store constructor values public"() {

        const r = new Rectangle(10, 20, 50, 60);
        expect(r.x).to.equal(10);
        expect(r.y).to.equal(20);
        expect(r.w).to.equal(50);
        expect(r.h).to.equal(60);
    }

    @test ".set() can get only two of four parameters"() {

        const r = new Rectangle(10, 20, 50, 60);
        r.set(5, 10);
        expect(r.x).to.equal(5);
        expect(r.y).to.equal(10);
        expect(r.w).to.equal(50);
        expect(r.h).to.equal(60);
    }

    @test "Must set right and bottom when x,y,w,h changes"() {

        const r = new Rectangle(10, 20, 50, 60);
        expect(r.right).to.equal(60);
        expect(r.bottom).to.equal(80);

        // change x and y
        r.set(20, 30);
        expect(r.right).to.equal(70);
        expect(r.bottom).to.equal(90);
    }
}