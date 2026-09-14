import AccessControl "mo:caffeineai-authorization/access-control";
import Map "mo:core/Map";

module {
  type CapsuleId = Nat;
  type Capsule = {
    id : CapsuleId;
    title : Text;
    message : Text;
    unlockAt : Int;
  };

  type OldActor = {};

  type NewActor = {
    accessControlState : AccessControl.AccessControlState;
    capsules : Map.Map<CapsuleId, Capsule>;
    capsuleCounter : { var nextId : CapsuleId };
  };

  public func migration(_old : OldActor) : NewActor {
    {
      accessControlState = AccessControl.initState();
      capsules = Map.empty();
      capsuleCounter = { var nextId = 0 };
    };
  };
};
