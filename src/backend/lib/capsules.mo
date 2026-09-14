import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Types "../types/capsules";

module {
  public func createCapsule(
    capsules : Map.Map<Types.CapsuleId, Types.Capsule>,
    counter : { var nextId : Types.CapsuleId },
    title : Text,
    message : Text,
    unlockAt : Int,
  ) : Types.Capsule {
    assert message.size() > 0;
    assert unlockAt > Time.now();
    let id = counter.nextId;
    counter.nextId += 1;
    let capsule : Types.Capsule = { id; title; message; unlockAt };
    capsules.add(id, capsule);
    capsule
  };

  public func listCapsules(capsules : Map.Map<Types.CapsuleId, Types.Capsule>) : [Types.Capsule] {
    capsules.values().toArray()
  };

  public func getCapsule(capsules : Map.Map<Types.CapsuleId, Types.Capsule>, id : Types.CapsuleId) : ?Types.Capsule {
    capsules.get(id)
  };
};
