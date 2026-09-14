import AccessControl "mo:caffeineai-authorization/access-control";
import MixinAuthorization "mo:caffeineai-authorization/MixinAuthorization";
import Expose "mo:caffeineai-oql/Expose";
import Map "mo:core/Map";
import Types "types/capsules";
import CapsulesApi "mixins/capsules-api";
import ApiDocMixin "mixins/api-doc";
import Entity "mo:caffeineai-oql/Entity";
import MapEntity "mo:caffeineai-oql/MapEntity";
import RecordValue "mo:caffeineai-oql/RecordValue";
import NatValue "mo:caffeineai-oql/NatValue";
import TextValue "mo:caffeineai-oql/TextValue";
import IntValue "mo:caffeineai-oql/IntValue";

actor {
  let accessControlState : AccessControl.AccessControlState;
  let capsules : Map.Map<Types.CapsuleId, Types.Capsule>;
  let capsuleCounter : { var nextId : Types.CapsuleId };
  include MixinAuthorization(accessControlState, null);
  include CapsulesApi(capsules, capsuleCounter);
  include ApiDocMixin();
  include Expose({
    entities = [
      capsules.toEntity("capsule", "Capsule", "id")
        .sample({ id = 0; title = ""; message = ""; unlockAt = 0 })
        .controllerOnly()
        .build(),
    ];
  });
};
