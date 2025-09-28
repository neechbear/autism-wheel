import { ApplicationState, ProfileCategory } from '../types';

export const DEFAULT_CATEGORIES: ProfileCategory[] = [
  {
    id: 'social',
    name: 'Social Interaction & Relationships',
    description: "The energy and comfort involved in connecting with others. A low score suggests fulfilling social connections with minimal strain. A high score reflects profound difficulty or exhaustion from social demands, leading to isolation, burnout, or a complete inability to engage, requiring significant support to maintain relationships.",
    icon: '💏',
    color: '#66c5cc',
  },
  {
    id: 'communication',
    name: 'Communication Differences',
    description: "How you understand and express information. A low score means easy, fluid communication in your preferred style. A high score reflects significant challenges, such as being non-speaking, experiencing situational mutism, or having profound difficulty processing verbal language, requiring AAC or other extensive supports.",
    icon: '🗨️',
    color: '#f6cf71',
  },
  {
    id: 'sensory',
    name: 'Sensory Experiences',
    description: "Your unique sensory landscape. A low score indicates manageable sensitivities or a balanced sensory profile. A high score means extreme hyper- or hyposensitivities that are disabling, causing severe distress, sensory overload, or making it impossible to navigate everyday environments without extensive accommodations.",
    icon: '👂',
    color: '#f89c74',
  },
  {
    id: 'stimming',
    name: 'Stimming & Self-Regulation',
    description: "The use of self-regulatory actions to manage internal states. A low score suggests stimming is a gentle, effective tool for comfort. A high score indicates a constant, intense need for regulation, or the presence of harmful stims (e.g., head-banging) in response to extreme distress, requiring intervention for safety.",
    icon: '👋',
    color: '#dcb0f2',
  },
  {
    id: 'interests',
    name: 'Passionate Interests',
    description: "The intensity and role of deep, focused interests. A low score reflects enjoyable hobbies that are easily balanced with other life demands. A high score indicates an all-consuming, monotropic focus that is essential for well-being but can make it extremely difficult to shift attention to other critical life tasks.",
    icon: '🔍',
    color: '#87c55f',
  },
  {
    id: 'executive',
    name: 'Executive Functioning',
    description: "The mental energy for planning, starting, and organizing tasks. A low score means these processes are relatively smooth. A high score reflects profound challenges like autistic inertia, time blindness, and difficulty with self-care, making independent living nearly impossible without constant structure and support.",
    icon: '🏠',
    color: '#9eb9f3',
  },
  {
    id: 'emotional',
    name: 'Emotional Experiences & Regulation',
    description: "The intensity of your emotions and the effort needed to manage them. A low score indicates a manageable emotional landscape. A high score reflects intensely felt emotions, frequent dysregulation, alexithymia, or debilitating meltdowns/shutdowns that severely impact daily life and require a highly supportive environment.",
    icon: '😰',
    color: '#fe88b1',
  },
  {
    id: 'routine',
    name: 'Need for Predictability & Routine',
    description: "The level of reliance on structure to feel safe and regulated. A low score suggests a preference for routine but with easy flexibility. A high score indicates a profound need for sameness, where even minor changes cause extreme distress, anxiety, or a meltdown, requiring a highly controlled and predictable environment.",
    icon: '🔄',
    color: '#c9db74',
  },
  {
    id: 'cognitive',
    name: 'Cognitive Profile & Learning Style',
    description: "Your distinct way of thinking and learning. A low score means your learning style is easily accommodated. A high score reflects a significant mismatch with standard educational or work environments, or the presence of a co-occurring intellectual disability, requiring highly specialized and individualized support to learn.",
    icon: '📚',
    color: '#8be0a4',
  },
  {
    id: 'motor',
    name: 'Motor Skills & Coordination',
    description: "The connection between mind and body for movement. A low score suggests fluid motor skills. A high score reflects significant dyspraxia, poor balance, or challenges with fine/gross motor skills that impact independence in daily tasks like dressing or writing, and may lead to conditions like autistic catatonia.",
    icon: '🤸‍♀️',
    color: '#b497e7',
  }
];

export const initialState: ApplicationState = {
  version: 1,
  currentView: 'main',
  profile: {
    selections: {},
  },
  categories: DEFAULT_CATEGORIES,
  settings: {
    showNumbers: true,
    showLabels: true,
    showIcons: true,
    theme: 'system',
  },
};