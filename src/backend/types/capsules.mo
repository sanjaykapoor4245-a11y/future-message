module {
  public type CapsuleId = Nat;

  public type Capsule = {
    id : CapsuleId;
    title : Text;
    message : Text;
    unlockAt : Int; // nanoseconds since epoch
  };
};
