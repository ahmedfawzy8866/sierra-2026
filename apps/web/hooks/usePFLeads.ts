"use client";

import { useState, useEffect, useMemo } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  DocumentData,
} from "firebase/firestore";

export type LeadStage =
  | "new_inquiry"
  | "contacted"
  | "viewing_scheduled"
  | "viewing_done"
  | "offer_submitted"
  | "closed_won"
  | "closed_lost";

export type LeadStatus = "pending_review" | "active" | "warm" | "hot" | "cold";

export interface CRMLead extends DocumentData {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source: "property_finder" | "whatsapp" | "telegram" | "direct";
  sbrCodeInterest: string;
  listingId?: string;
  pfLeadId?: string;
  status: LeadStatus;
  stage: LeadStage;
  neuralMatchScore?: number;
  leilaScore?: number;
  agentAssigned?: string;
  budgetMin?: number;
  budgetMax?: number;
  preferredCompounds?: string[];
  lastContact?: Date;
  createdAt: Date;
}

export interface UsePFLeadsReturn {
  leads: CRMLead[];
  grouped: Map<LeadStage, CRMLead[]>;
  hot: CRMLead[];
  loading: boolean;
  error: string | null;
  updateStage: (leadId: string, stage: LeadStage) => Promise<void>;
  updateStatus: (leadId: string, status: LeadStatus) => Promise<void>;
  assignAgent: (leadId: string, agentId: string) => Promise<void>;
  totalPFLeads: number;
  conversionRate: number;
}

const STAGE_ORDER: LeadStage[] = [
  "new_inquiry",
  "contacted",
  "viewing_scheduled",
  "viewing_done",
  "offer_submitted",
  "closed_won",
  "closed_lost",
];

export function usePFLeads(
  options: {
    sourceFilter?: "property_finder" | "all";
    minNeuralScore?: number;
    agentId?: string;
    maxLimit?: number;
  } = {}
): UsePFLeadsReturn {
  const {
    sourceFilter   = "property_finder",
    minNeuralScore = 0,
    maxLimit       = 100,
  } = options;

  const [leads,   setLeads]   = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    const db = getFirestore();
    const whereConstraints: ReturnType<typeof where>[] = [];

    if (sourceFilter === "property_finder") {
      whereConstraints.push(where("source", "==", "property_finder"));
    }
    if (options.agentId) {
      whereConstraints.push(where("agentAssigned", "==", options.agentId));
    }

    const q = query(
      collection(db, "leads"),
      ...whereConstraints,
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        let docs = snap.docs.map(d => ({ id: d.id, ...d.data() } as CRMLead));
        if (minNeuralScore > 0) {
          docs = docs.filter(l => (l.neuralMatchScore ?? 0) >= minNeuralScore);
        }
        setLeads(docs.slice(0, maxLimit));
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [sourceFilter, minNeuralScore, options.agentId, maxLimit]);

  const grouped = useMemo(() => {
    const map = new Map<LeadStage, CRMLead[]>();
    for (const stage of STAGE_ORDER) map.set(stage, []);
    for (const lead of leads) {
      const bucket = map.get(lead.stage) ?? [];
      bucket.push(lead);
      map.set(lead.stage, bucket);
    }
    return map;
  }, [leads]);

  const hot = useMemo(
    () => leads.filter(l => (l.neuralMatchScore ?? 0) >= 85),
    [leads]
  );

  const conversionRate = useMemo(() => {
    if (!leads.length) return 0;
    const closed = leads.filter(l => l.stage === "closed_won").length;
    return Math.round((closed / leads.length) * 100);
  }, [leads]);

  const db = getFirestore();

  const updateStage = async (leadId: string, stage: LeadStage) => {
    await updateDoc(doc(db, "leads", leadId), {
      stage,
      lastContact: serverTimestamp(),
      updatedAt:   serverTimestamp(),
    });
  };

  const updateStatus = async (leadId: string, status: LeadStatus) => {
    await updateDoc(doc(db, "leads", leadId), {
      status,
      updatedAt: serverTimestamp(),
    });
  };

  const assignAgent = async (leadId: string, agentId: string) => {
    await updateDoc(doc(db, "leads", leadId), {
      agentAssigned: agentId,
      updatedAt:     serverTimestamp(),
    });
  };

  return {
    leads,
    grouped,
    hot,
    loading,
    error,
    updateStage,
    updateStatus,
    assignAgent,
    totalPFLeads: leads.length,
    conversionRate,
  };
}
