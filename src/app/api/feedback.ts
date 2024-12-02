import { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';

// Types
type FeedbackType = 'suggestion' | 'bug';

interface FeedbackRequest {
  title: string;
  description: string;
  type: FeedbackType;
  name: string;
  email: string;
}

// Configuration
const octokit = new Octokit({
  auth: process.env.NEXT_PUBLIC_GITHUB_TOKEN,
});

const REPO_OWNER = process.env.GITHUB_REPO_OWNER || "DiamondStrand";
const REPO_NAME = process.env.GITHUB_REPO_NAME || "pixai";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Method validation
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Input validation
  const { title, description, type, name, email } = req.body as FeedbackRequest;
  
  if (!title || !description || !type || !name || !email) {
    return res.status(400).json({ 
      message: 'Missing required fields' 
    });
  }

  if (!['suggestion', 'bug'].includes(type)) {
    return res.status(400).json({ 
      message: 'Invalid feedback type' 
    });
  }

  if (!email.endsWith('@gmail.com')) {
    return res.status(400).json({ message: 'Invalid email domain' });
  }

  try {
    const response = await octokit.issues.create({
      owner: REPO_OWNER,
      repo: REPO_NAME,
      title: `[${type.toUpperCase()}] ${title}`,
      body: `**Submitted by:** ${name}\n**Email:** ${email}\n\n${description}`,
      labels: [type],
    });

    return res.status(200).json({ 
      issueUrl: response.data.html_url,
      message: 'Feedback submitted successfully'
    });

  } catch (error) {
    console.error('Error creating GitHub issue:', error);
    return res.status(500).json({ 
      message: 'Failed to create issue',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}