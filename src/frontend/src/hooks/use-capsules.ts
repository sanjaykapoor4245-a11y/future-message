import { createActor } from "@/backend";
import { type Capsule, timestampToDate } from "@/lib/capsules";
import { useActor } from "@caffeineai/core-infrastructure";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const CAPSULES_KEY = ["capsules"];

export interface NewCapsuleInput {
  title: string;
  message: string;
  unlockAt: Date;
}

function mapCapsule(capsule: {
  id: bigint;
  title: string;
  message: string;
  unlockAt: bigint;
}): Capsule {
  return {
    id: capsule.id.toString(),
    title: capsule.title,
    message: capsule.message,
    unlockAt: timestampToDate(capsule.unlockAt) ?? new Date(0),
  };
}

/** Lists all saved capsules from the backend. */
export function useCapsules() {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: CAPSULES_KEY,
    queryFn: async (): Promise<Capsule[]> => {
      if (!actor) return [];
      const capsules = await actor.listCapsules();
      return capsules.map(mapCapsule);
    },
    enabled: !!actor && !isFetching,
  });
}

/** Fetches a single capsule by id from the backend. */
export function useCapsule(id: string) {
  const { actor, isFetching } = useActor(createActor);
  return useQuery({
    queryKey: [...CAPSULES_KEY, id],
    queryFn: async (): Promise<Capsule | null> => {
      if (!actor) return null;
      const capsule = await actor.getCapsule(BigInt(id));
      return capsule ? mapCapsule(capsule) : null;
    },
    enabled: !!actor && !isFetching && id.length > 0,
  });
}

/** Creates a new capsule on the backend. */
export function useCreateCapsule() {
  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: NewCapsuleInput): Promise<Capsule> => {
      if (!actor) throw new Error("Backend is not ready");
      const unlockAtNs = BigInt(input.unlockAt.getTime()) * 1_000_000n;
      const capsule = await actor.createCapsule(
        input.title,
        input.message,
        unlockAtNs,
      );
      return mapCapsule(capsule);
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: CAPSULES_KEY });
    },
  });
}
