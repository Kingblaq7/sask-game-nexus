import { v4 } from "crypto";

const genId = () => crypto.randomUUID();

export interface Project {
  id: string;
  name: string;
  description: string;
  creator: string;
  status: "idea" | "building" | "live";
  members: string[];
  blockchain: string;
  created_at: string;
}

export interface Proposal {
  id: string;
  project_id: string | null;
  title: string;
  description: string;
  creator: string;
  votes_yes: number;
  votes_no: number;
  voters: { user: string; vote: string }[];
  status: "active" | "closed";
  created_at: string;
}

const PROJECTS_KEY = "w3gh:projects";
const PROPOSALS_KEY = "w3gh:proposals";

function read<T>(key: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Projects
export const getProjects = (): Project[] => read<Project>(PROJECTS_KEY);

export const createProject = (p: { name: string; description: string; status: string; creator: string }): Project => {
  const projects = getProjects();
  const project: Project = {
    id: genId(),
    name: p.name,
    description: p.description,
    creator: p.creator,
    status: (p.status as Project["status"]) || "idea",
    members: [p.creator],
    blockchain: "Base",
    created_at: new Date().toISOString(),
  };
  write(PROJECTS_KEY, [project, ...projects]);
  return project;
};

export const joinProject = (projectId: string, userEmail: string) => {
  const projects = getProjects();
  const idx = projects.findIndex((p) => p.id === projectId);
  if (idx === -1) throw new Error("Project not found");
  if (projects[idx].members.includes(userEmail)) throw new Error("Already a member");
  projects[idx].members.push(userEmail);
  write(PROJECTS_KEY, projects);
};

// Proposals
export const getProposals = (): Proposal[] => read<Proposal>(PROPOSALS_KEY);

export const createProposal = (p: { title: string; description: string; creator: string; project_id?: string }): Proposal => {
  const proposals = getProposals();
  const proposal: Proposal = {
    id: genId(),
    project_id: p.project_id || null,
    title: p.title,
    description: p.description,
    creator: p.creator,
    votes_yes: 0,
    votes_no: 0,
    voters: [],
    status: "active",
    created_at: new Date().toISOString(),
  };
  write(PROPOSALS_KEY, [proposal, ...proposals]);
  return proposal;
};

export const castVote = (proposalId: string, userEmail: string, vote: "yes" | "no") => {
  const proposals = getProposals();
  const idx = proposals.findIndex((p) => p.id === proposalId);
  if (idx === -1) throw new Error("Proposal not found");
  const prop = proposals[idx];
  if (prop.voters.some((v) => v.user === userEmail)) throw new Error("Already voted");
  prop.voters.push({ user: userEmail, vote });
  if (vote === "yes") prop.votes_yes++;
  else prop.votes_no++;
  write(PROPOSALS_KEY, proposals);
};
