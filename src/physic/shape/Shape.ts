import { CanCalculateContains } from "../collision/CanCalculateContains";
import { HasBounds } from "../collision/HasBounds";
import { Clonable } from "../../constraint/Clonable";

export interface Shape extends CanCalculateContains, HasBounds, Clonable<ThisType<Shape>> { }
