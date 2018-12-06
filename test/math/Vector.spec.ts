import { suite, test, slow, timeout } from "mocha-typescript";
import { expect } from "chai";
import { Vector } from "../../src/math/Vector";

@suite("math/Vector") class VectorSpec {

    @test "Public x and y are available"() {

        const v = new Vector(1, 2);
        expect(v.x).to.equal(1);
        expect(v.y).to.equal(2);
    }

    @test ".toString() must be overwritten"() {

        expect(new Vector(1, 2).toString()).to.equal(`${Vector.name}[1, 2]`);
    }

    @test "fromAngle() calculations must be correct"() {

        const angleVector = Vector.fromAngle(2);
        expect(angleVector.equals(
            Vector.from(-.4161468365, .909297426)
        )).to.be.true;
    }

    @test "Can get information from a DimensionPosition object"() {

        const staticVector = Vector.from({ x: 1, y: 2 });
        const constructionVector = new Vector({ x: 1, y: 2 });

        expect(staticVector.equals(constructionVector)).to.be.true;
        expect(staticVector.x).to.equal(1);
        expect(staticVector.y).to.equal(2);
    }

    @test "Addition of vectors"() {

        expect(Vector.from(1, 2).add(Vector.from(3, 4))).to.deep.equal(Vector.from(4, 6));
    }

    @test "Substraction of vectors"() {

        expect(Vector.from(3, 4).substract(Vector.from(1, 2))).to.deep.equal(Vector.from(2, 2));
    }

    @test "Division of vectors"() {

        expect(Vector.from(10, 20).divide(Vector.from(2, 4))).to.deep.equal(Vector.from(5, 5));

        // also test half
        expect(Vector.from(10, 20).half()).to.deep.equal(Vector.from(5, 10));
    }

    @test "Multiplication of vectors"() {

        expect(Vector.from(2, 3).multiply(Vector.from(3, 4))).to.deep.equal(Vector.from(6, 12));

        // also test the scale method
        expect(Vector.from(2, 3).scale(3)).to.deep.equal(Vector.from(6, 9));
    }

    @test "setXY() must work"() {

        const v = new Vector(1, 2);
        v.setXY(3, 4);
        expect(v.x).to.equal(3);
        expect(v.y).to.equal(4);
    }

    @test "Vector can be normalized"() {

        expect(Vector.from(3, 1).normalize().equals(Vector.from(.948683298, .31622776601))).to.be.true;
    }

    @test "Distance can be calculated"() {

        expect(Vector.from(2, 3).distance(Vector.from(8, 6))).to.be.closeTo(6.708203932499369, .000001);
    }

    @test "Magnitude can be calculates"() {

        expect(Vector.from(5, 8).magnitude()).to.be.closeTo(9.433981132056603, .000001);
    }

    @test "getAngle() should work"() {

        expect(Vector.from(2, 3).getAngle()).to.be.closeTo(.982793723, .000001);
    }

    @test "Vectors can be squared"() {

        expect(Vector.from(2, 3).square()).to.deep.equal(Vector.from(4, 9));
    }

    @test "Vectors can be doubled"() {

        expect(Vector.from(6, 3).double()).to.deep.equal(Vector.from(12, 6));
    }

    @test "Can be cloned"() {

        const v1 = new Vector(1, 2);
        const v2 = v1.clone();

        // reference must not match
        expect(v1).to.not.equal(v2);

        // x and y properties are cloned
        expect(v1).to.deep.equal(v2);
    }

    @test "Pointing directions can be calculated"() {

        expect(Vector.from(5, 0).isPointingRight()).to.be.true;
        expect(Vector.from(-3, 0).isPointingRight()).to.be.false;

        expect(Vector.from(5, 0).isPointingLeft()).to.be.false;
        expect(Vector.from(-3, 0).isPointingLeft()).to.be.true;

        expect(Vector.from(0, 2).isPointingUp()).to.be.false;
        expect(Vector.from(0, -2).isPointingUp()).to.be.true;

        expect(Vector.from(0, 2).isPointingDown()).to.be.true;
        expect(Vector.from(0, -2).isPointingDown()).to.be.false;
    }

    @test "Average can be calculated"() {

        expect(Vector.from(10, 10).average(Vector.from(20, 20))).to.deep.equal(Vector.from(15, 15));
    }


}