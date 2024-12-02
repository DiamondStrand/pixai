export interface DownloadUrls {
  original?: string;
  large2x?: string;
  large?: string;
  medium?: string;
  small?: string;
}

export interface SearchParams {
  query: string;
  orientation?: string;
  color?: string;
}

export interface PhotoUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface PhotoUser {
  username: string;
  name: string;
  links: {
    html: string;
  };
}

export interface RequestParams {
  params: {
    threadId: string;
  };
}

// Define a type for tool call output
export type ToolCallOutput =
  | string
  | number
  | boolean
  | Record<string, unknown>;

export interface ToolCallOutputs {
  tool_outputs: Array<{
    output: ToolCallOutput;
    tool_call_id: string;
  }>;
}

export interface RequestBody {
  toolCallOutputs: ToolCallOutputs;
  runId: string;
}

export interface Photo {
  id: string;
  width: number;
  height: number;
  urls: PhotoUrls;
  color: string | null;
  user: PhotoUser;
  alt_description: string | null;
}

export interface NormalizedPhoto {
  id: string;
  url: string;
  alt: string;
  photographer: string;
  photographer_url: string;
  source: string;
  orientation: "landscape" | "portrait";
  downloadUrls: Required<Pick<DownloadUrls, "original" | "large">> &
    Omit<DownloadUrls, "original" | "large">;
}

// Define a type for message annotations
export interface MessageAnnotation {
  type: string;
  text: string;
  [key: string]: unknown;
}

export interface AssistantMessageContent {
  text: {
    value: string;
    annotations?: MessageAnnotation[];
  };
}

export interface ThreadMessage {
  role: string;
  content: AssistantMessageContent[] | AssistantMessageContent;
}

export interface User {
  id: string;
  email: string;
  status: "pending" | "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

export interface CreateUserResult {
  success: boolean;
  user?: User;
  error?: {
    code: "EMAIL_EXISTS" | "PHONE_EXISTS" | "DATABASE_ERROR";
    message: string;
  };
}

export interface CreateUserData {
  firstname: string;
  lastname: string;
  phone: string;
  email: string;
}

export interface CookieOptions {
  name: string;
  value: string;
  [key: string]: string | number | boolean | undefined;
}

export interface AIResponseContent {
  query: string;
  orientation?: string;
  color?: string;
}

export interface AssistantResponse {
  text: {
    value: string;
    annotations?: Array<{
      type: string;
      text: string;
      [key: string]: unknown;
    }>;
  };
}

export interface ChatMessage {
  role: string;
  content: string | AssistantResponse | AssistantResponse[];
}

export interface ThreadResponse {
  messages: ChatMessage[];
  response: {
    content: string | AssistantResponse | AssistantResponse[];
  };
}

export interface CloudinaryUploadResult {
  info: {
    secure_url: string;
    public_id: string;
    [key: string]: unknown;
  };
}

export interface ImageFormData {
  title: string;
  description: string;
  photographer: string;
  email: string;
  tags: string[];
  imageUrl: string;
  publicId: string;
}

export interface QuoteProps {
  quote: string;
  title: string;
  description: string;
}

export interface TestimonialData {
  avatarUrl: string;
  quote: string;
  name: string;
  role: string;
}

export interface StatsData {
  activeUsers: number;
  countries: number;
}

// Replace the empty interface with a type alias
export type UserAuthFormProps = React.HTMLAttributes<HTMLDivElement>;
