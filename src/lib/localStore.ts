const genId = () => crypto.randomUUID();
const genCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

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

export interface Campaign {
  id: string;
  project_id: string | null;
  project_name: string;
  title: string;
  description: string;
  reward_type: "USDT" | "token" | "fixed";
  reward_amount: number;
  requirements: string;
  deliverables: string;
  deadline: string;
  status: "active" | "closed";
  creator: string;
  created_at: string;
}

export interface Application {
  id: string;
  campaign_id: string;
  user_id: string;
  username: string;
  status: "pending" | "approved" | "rejected";
  submission_links: string;
  message: string;
  created_at: string;
}

export interface Referral {
  id: string;
  user_id: string;
  referral_code: string;
  clicks: number;
  signups: number;
}

export interface Earning {
  id: string;
  user_id: string;
  campaign_id: string;
  campaign_title: string;
  amount: number;
  status: "pending" | "approved" | "paid";
  created_at: string;
}

export interface Contract {
  id: string;
  name: string;
  type: "Casino Game" | "Betting Pool" | "NFT Asset";
  address: string;
  creator: string;
  status: "active" | "pending";
  created_at: string;
}

export interface Withdrawal {
  id: string;
  user_id: string;
  amount: number;
  wallet_address: string;
  status: "pending" | "completed";
  created_at: string;
}

const PROJECTS_KEY = "w3gh:projects";
const PROPOSALS_KEY = "w3gh:proposals";
const CAMPAIGNS_KEY = "w3gh:campaigns";
const APPLICATIONS_KEY = "w3gh:applications";
const REFERRALS_KEY = "w3gh:referrals";
const EARNINGS_KEY = "w3gh:earnings";
const WITHDRAWALS_KEY = "w3gh:withdrawals";

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

// Campaigns
export const getCampaigns = (): Campaign[] => read<Campaign>(CAMPAIGNS_KEY);

export const getCampaignById = (id: string): Campaign | undefined =>
  getCampaigns().find((c) => c.id === id);

export const createCampaign = (c: {
  project_name: string;
  title: string;
  description: string;
  reward_type: Campaign["reward_type"];
  reward_amount: number;
  requirements: string;
  deliverables: string;
  deadline: string;
  creator: string;
  project_id?: string;
}): Campaign => {
  const campaigns = getCampaigns();
  const campaign: Campaign = {
    id: genId(),
    project_id: c.project_id || null,
    project_name: c.project_name,
    title: c.title,
    description: c.description,
    reward_type: c.reward_type,
    reward_amount: c.reward_amount,
    requirements: c.requirements,
    deliverables: c.deliverables,
    deadline: c.deadline,
    status: "active",
    creator: c.creator,
    created_at: new Date().toISOString(),
  };
  write(CAMPAIGNS_KEY, [campaign, ...campaigns]);
  return campaign;
};

export const closeCampaign = (id: string, creator: string) => {
  const campaigns = getCampaigns();
  const idx = campaigns.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error("Campaign not found");
  if (campaigns[idx].creator !== creator) throw new Error("Not authorized");
  campaigns[idx].status = "closed";
  write(CAMPAIGNS_KEY, campaigns);
};

// Applications
export const getApplications = (): Application[] => read<Application>(APPLICATIONS_KEY);

export const getApplicationsByCampaign = (campaignId: string): Application[] =>
  getApplications().filter((a) => a.campaign_id === campaignId);

export const getApplicationsByUser = (userId: string): Application[] =>
  getApplications().filter((a) => a.user_id === userId);

export const applyForCampaign = (a: {
  campaign_id: string;
  user_id: string;
  username: string;
  submission_links: string;
  message: string;
}): Application => {
  const apps = getApplications();
  if (apps.some((x) => x.campaign_id === a.campaign_id && x.user_id === a.user_id))
    throw new Error("Already applied");
  const app: Application = {
    id: genId(),
    campaign_id: a.campaign_id,
    user_id: a.user_id,
    username: a.username,
    status: "pending",
    submission_links: a.submission_links,
    message: a.message,
    created_at: new Date().toISOString(),
  };
  write(APPLICATIONS_KEY, [...apps, app]);
  return app;
};

export const updateApplicationStatus = (id: string, status: Application["status"]) => {
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Application not found");
  apps[idx].status = status;
  write(APPLICATIONS_KEY, apps);

  // If approved, create an earning entry
  if (status === "approved") {
    const app = apps[idx];
    const campaign = getCampaignById(app.campaign_id);
    if (campaign) {
      const earnings = getEarnings();
      const earning: Earning = {
        id: genId(),
        user_id: app.user_id,
        campaign_id: campaign.id,
        campaign_title: campaign.title,
        amount: campaign.reward_amount,
        status: "pending",
        created_at: new Date().toISOString(),
      };
      write(EARNINGS_KEY, [...earnings, earning]);
    }
  }
};

// Referrals
export const getReferrals = (): Referral[] => read<Referral>(REFERRALS_KEY);

export const getUserReferral = (userId: string): Referral => {
  const refs = getReferrals();
  let ref = refs.find((r) => r.user_id === userId);
  if (!ref) {
    ref = { id: genId(), user_id: userId, referral_code: genCode(), clicks: 0, signups: 0 };
    write(REFERRALS_KEY, [...refs, ref]);
  }
  return ref;
};

export const trackReferralClick = (code: string) => {
  const refs = getReferrals();
  const idx = refs.findIndex((r) => r.referral_code === code);
  if (idx !== -1) {
    refs[idx].clicks++;
    write(REFERRALS_KEY, refs);
  }
};

export const trackReferralSignup = (code: string) => {
  const refs = getReferrals();
  const idx = refs.findIndex((r) => r.referral_code === code);
  if (idx !== -1) {
    refs[idx].signups++;
    write(REFERRALS_KEY, refs);
  }
};

// Earnings
export const getEarnings = (): Earning[] => read<Earning>(EARNINGS_KEY);

export const getUserEarnings = (userId: string): Earning[] =>
  getEarnings().filter((e) => e.user_id === userId);

export const approveEarning = (id: string) => {
  const earnings = getEarnings();
  const idx = earnings.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Earning not found");
  earnings[idx].status = "approved";
  write(EARNINGS_KEY, earnings);
};

export const markEarningPaid = (id: string) => {
  const earnings = getEarnings();
  const idx = earnings.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error("Earning not found");
  earnings[idx].status = "paid";
  write(EARNINGS_KEY, earnings);
};

// Withdrawals
export const getWithdrawals = (): Withdrawal[] => read<Withdrawal>(WITHDRAWALS_KEY);

export const getUserWithdrawals = (userId: string): Withdrawal[] =>
  getWithdrawals().filter((w) => w.user_id === userId);

export const requestWithdrawal = (w: {
  user_id: string;
  amount: number;
  wallet_address: string;
}): Withdrawal => {
  // Check available balance
  const earnings = getUserEarnings(w.user_id);
  const totalApproved = earnings
    .filter((e) => e.status === "approved")
    .reduce((sum, e) => sum + e.amount, 0);
  const withdrawn = getUserWithdrawals(w.user_id)
    .filter((wd) => wd.status === "completed")
    .reduce((sum, wd) => sum + wd.amount, 0);
  const pendingWithdrawals = getUserWithdrawals(w.user_id)
    .filter((wd) => wd.status === "pending")
    .reduce((sum, wd) => sum + wd.amount, 0);
  const available = totalApproved - withdrawn - pendingWithdrawals;
  if (w.amount > available) throw new Error("Insufficient balance");
  if (w.amount <= 0) throw new Error("Invalid amount");

  const withdrawals = getWithdrawals();
  const withdrawal: Withdrawal = {
    id: genId(),
    user_id: w.user_id,
    amount: w.amount,
    wallet_address: w.wallet_address,
    status: "pending",
    created_at: new Date().toISOString(),
  };
  write(WITHDRAWALS_KEY, [...withdrawals, withdrawal]);
  return withdrawal;
};
