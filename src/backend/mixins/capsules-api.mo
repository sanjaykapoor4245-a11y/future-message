import Map "mo:core/Map";
import Types "../types/capsules";
import CapsulesLib "../lib/capsules";

mixin (
  capsules : Map.Map<Types.CapsuleId, Types.Capsule>,
  capsuleCounter : { var nextId : Types.CapsuleId },
) {
  public func createCapsule(title : Text, message : Text, unlockAt : Int) : async Types.Capsule {
    CapsulesLib.createCapsule(capsules, capsuleCounter, title, message, unlockAt)
  };

  public query func listCapsules() : async [Types.Capsule] {
    CapsulesLib.listCapsules(capsules)
  };

  public query func getCapsule(id : Types.CapsuleId) : async ?Types.Capsule {
    CapsulesLib.getCapsule(capsules, id)
  };
};
