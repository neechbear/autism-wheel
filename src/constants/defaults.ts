/*
 * ⚠️  IMPORTANT CSS RULES FOR AI AGENTS ⚠️
 *
 * 1. NEVER use CSS !important declarations except for:
 *    - Completely hiding elements (display: none !important)
 *    - Print media styles (for paper printing)
 *
 * 2. NEVER use inline style="" attributes on HTML elements
 *    - All styling MUST be via dedicated CSS files
 *    - Use CSS Modules for component-specific styles
 *    - Use global.css for shared design tokens
 *
 * Violation of these rules is STRICTLY FORBIDDEN.
 */

// Default data and constants for the Autism Wheel application

import type { ProfileCategory } from '../types';

export const ASD_LABELS = [
  { text: "ASD-1", radius: 97 }, // Centered between segment 1 and 4: (MIN_RADIUS + (MIN_RADIUS + 4*RING_WIDTH)) / 2
  { text: "ASD-2", radius: 139 }, // Between ring 4 and 5: MIN_RADIUS + 4 * RING_WIDTH
  { text: "ASD-3", radius: 202 }, // Between ring 7 and 8: MIN_RADIUS + 7 * RING_WIDTH
];

// Category preset definitions
export const CATEGORY_PRESETS = {
  default: {
    name: 'Autism wheel categories',
    description: 'The default autism profile categories covering key areas of autistic experience',
    categories: [
      {
        name: 'Social Interaction & Relationships',
        icon: '💏',
        description: 'The energy and comfort involved in connecting with others. A low score suggests fulfilling social connections with minimal strain. A high score reflects profound difficulty or exhaustion from social demands, leading to isolation, burnout, or a complete inability to engage, requiring significant support to maintain relationships.'
      },
      {
        name: 'Communication Differences',
        icon: '🗨️',
        description: 'How you understand and express information. A low score means easy, fluid communication in your preferred style. A high score reflects significant challenges, such as being non-speaking, experiencing situational mutism, or having profound difficulty processing verbal language, requiring AAC or other extensive supports.'
      },
      {
        name: 'Sensory Experiences',
        icon: '👂',
        description: 'Your unique sensory landscape. A low score indicates manageable sensitivities or a balanced sensory profile. A high score means extreme hyper- or hyposensitivities that are disabling, causing severe distress, sensory overload, or making it impossible to navigate everyday environments without extensive accommodations.'
      },
      {
        name: 'Stimming & Self-Regulation',
        icon: '👋',
        description: 'The use of self-regulatory actions to manage internal states. A low score suggests stimming is a gentle, effective tool for comfort. A high score indicates a constant, intense need for regulation, or the presence of harmful stims (e.g., head-banging) in response to extreme distress, requiring intervention for safety.'
      },
      {
        name: 'Passionate Interests',
        icon: '🔍',
        description: 'The intensity and role of deep, focused interests. A low score reflects enjoyable hobbies that are easily balanced with other life demands. A high score indicates an all-consuming, monotropic focus that is essential for well-being but can make it extremely difficult to shift attention to other critical life tasks.'
      },
      {
        name: 'Executive Functioning',
        icon: '🏠',
        description: 'The mental energy for planning, starting, and organizing tasks. A low score means these processes are relatively smooth. A high score reflects profound challenges like autistic inertia, time blindness, and difficulty with self-care, making independent living nearly impossible without constant structure and support.'
      },
      {
        name: 'Emotional Experiences & Regulation',
        icon: '😰',
        description: 'The intensity of your emotions and the effort needed to manage them. A low score indicates a manageable emotional landscape. A high score reflects intensely felt emotions, frequent dysregulation, alexithymia, or debilitating meltdowns/shutdowns that severely impact daily life and require a highly supportive environment.'
      },
      {
        name: 'Need for Predictability & Routine',
        icon: '♻️',
        description: 'The level of reliance on structure to feel safe and regulated. A low score suggests a preference for routine but with easy flexibility. A high score indicates a profound need for sameness, where even minor changes cause extreme distress, anxiety, or a meltdown, requiring a highly controlled and predictable environment.'
      },
      {
        name: 'Cognitive Profile & Learning Style',
        icon: '📚',
        description: 'Your distinct way of thinking and learning. A low score means your learning style is easily accommodated. A high score reflects a significant mismatch with standard educational or work environments, or the presence of a co-occurring intellectual disability, requiring highly specialized and individualized support to learn.'
      },
      {
        name: 'Motor Skills & Coordination',
        icon: '🤸‍♀️',
        description: 'The connection between mind and body for movement. A low score suggests fluid motor skills. A high score reflects significant dyspraxia, poor balance, or challenges with fine/gross motor skills that impact independence in daily tasks like dressing or writing, and may lead to conditions like autistic catatonia.'
      }
    ]
  },
  sensory: {
    name: 'Sensory wheel categories',
    description: 'Categories focused specifically on the eight sensory processing areas',
    categories: [
      {
        name: 'Sound (Auditory)',
        icon: '👂',
        description: 'Your unique response to sound. A low score indicates you can generally filter background noise and tolerate everyday sounds. A high score reflects extreme sensitivity (hyper), where common noises are painful or overwhelming, or under-sensitivity (hypo), where you might seek out loud, intense sounds to feel regulated.'
      },
      {
        name: 'Sight (Visual)',
        icon: '👁️',
        description: 'Your experience of the visual world. A low score suggests you handle typical lighting and visual clutter comfortably. A high score can mean hypersensitivity, where bright lights or busy patterns are disorienting, or hyposensitivity, where you might be drawn to intense visual stimuli like flashing lights to feel engaged.'
      },
      {
        name: 'Smell (Olfactory)',
        icon: '👃',
        description: 'Your sensitivity and reaction to different scents. A low score means you notice smells but are not typically overwhelmed. A high score can indicate hypersensitivity, where common smells like perfume or food are nauseating, or hyposensitivity, where you might not notice strong odours or may actively seek them out.'
      },
      {
        name: 'Touch (Tactile)',
        icon: '✋',
        description: 'Your experience of physical contact and textures on your skin. A low score indicates comfort with varied clothing, temperatures, and types of touch. A high score can mean hypersensitivity, making clothing tags or light touch feel painful, or hyposensitivity, where you might not notice pain or may seek deep pressure to feel calm.'
      },
      {
        name: 'Taste (Gustatory)',
        icon: '👅',
        description: 'Your sensitivity to flavours and textures in your mouth. A low score means you enjoy a varied diet without issue. A high score can mean hypersensitivity leading to a restricted diet where certain textures are unbearable, or hyposensitivity where you crave extremely strong flavours (e.g., very spicy or sour) to register the taste.'
      },
      {
        name: 'Internal Sensations (Interoception)',
        icon: '💝',
        description: 'Your ability to perceive signals from inside your body. A low score means you reliably notice internal cues like hunger, thirst, or pain. A high score reflects difficulty recognising these signals, which can lead to not eating until famished, not drinking until dehydrated, or not identifying emotions until they become overwhelming.'
      },
      {
        name: 'Balance (Vestibular)',
        icon: '🤸‍♀',
        description: 'Your internal sense of balance, movement, and spatial orientation. A low score suggests you feel stable and coordinated. A high score might reflect hypersensitivity, causing motion sickness from small movements, or hyposensitivity, leading to a need for intense movement like spinning or rocking to feel regulated.'
      },
      {
        name: 'Body Awareness (Proprioception)',
        icon: '🚶‍♂️',
        description: 'Your brain\'s unconscious awareness of where your body is in space. A low score means you move with confidence and rarely misjudge force. A high score can manifest as clumsiness, bumping into objects, or using too much or too little force (e.g., writing too hard or holding things too loosely), often seeking deep pressure to get a better sense of your body.'
      }
    ]
  }
} as const;

// Which preset to use as the default when the app loads
export const DEFAULT_PRESET_KEY = 'default' as const;

export const DEFAULT_SLICE_COLORS = [
  '#66c5cc',
  '#f6cf71',
  '#f89c74',
  '#dcb0f2',
  '#87c55f',
  '#9eb9f3',
  '#fe88b1',
  '#c9db74',
  '#8be0a4',
  '#b497e7',
];

// Derived arrays for backward compatibility (if needed elsewhere)
export const DEFAULT_SLICE_LABELS = CATEGORY_PRESETS.default.categories.map(cat => cat.name);
export const DEFAULT_SLICE_ICONS = CATEGORY_PRESETS.default.categories.map(cat => cat.icon);
export const DEFAULT_SLICE_DESCRIPTIONS = CATEGORY_PRESETS.default.categories.map(cat => cat.description);

export const SENSORY_SLICE_LABELS = CATEGORY_PRESETS.sensory.categories.map(cat => cat.name);
export const SENSORY_SLICE_ICONS = CATEGORY_PRESETS.sensory.categories.map(cat => cat.icon);
export const SENSORY_SLICE_DESCRIPTIONS = CATEGORY_PRESETS.sensory.categories.map(cat => cat.description);

// Emoji categories for the emoji picker
export const EMOJI_CATEGORIES = {
  'People': ['😀', '😊', '🥰', '😎', '🤔', '😰', '😭', '🥱', '😴', '🤗', '🤓', '😇', '🙂', '😉', '😍', '🤩', '😘', '😗', '☺️', '😚', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤭', '🤫', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😷', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '🧐'],
  'Body Parts': ['👁️', '👀', '👂', '👃', '👄', '👅', '🦷', '🧠', '🫀', '🫁', '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧓', '👴', '👵', '👤', '👥', '🗣️', '👣', '🦴', '🦵', '🦶', '💪', '🤳', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤝', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '🙏'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪲', '🐛', '🦋', '🐌', '🐞', '🐜', '🪱', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛'],
  'Food': ['🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🫔', '🥙', '🧆', '🥚', '🍳', '🍲', '🫕', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🥟', '🥠', '🥡', '🦪', '🍦', '🍧', '🎂', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🫗', '🥤', '🧋', '🧃', '🧉', '🧊'],
  'Medical & Therapy': ['🏥', '⚕️', '🩺', '💊', '💉', '🩹', '🩼', '🦽', '🦼', '🧑‍⚕️', '👨‍⚕️', '👩‍⚕️', '🧬', '🦠', '🧪', '🔬', '🌡️', '🩸', '🫁', '🧠', '🫀', '🦴', '👁️‍🗨️', '🗨️', '💬', '🗣️', '👂', '👁️', '🔍', '🔎', '📋', '📝', '📊', '📈', '📉', '🎯', '🧩', '🎲', '🃏', '🎴', '🀄'],
  'Gestures': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  'Activities': ['🤸‍♂️', '🤸‍♀', '🏃‍♀️', '🏃‍♂️', '🚶‍♀️', '🚶‍♂️', '🧘‍♀️', '🧘‍♂️', '🏋️‍♀️', '🏋️‍♂️', '🤾‍♀️', '🤾‍♂️', '🏌️‍♀️', '🏌️‍♂️', '🏄‍♀️', '🏄‍♂️', '🚣‍♀️', '🚣‍♂️', '🏊‍♀️', '🏊‍♂️', '⛹️‍♀️', '⛹️‍♂️', '🏇', '🧗‍♀️', '🧗‍♂️', '🚴‍♀️', '🚴‍♂️', '🤹‍♀️', '🤹‍♂️', '🎭', '🎨', '🎪', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥁', '🎹', '🎸', '🎺', '🎷', '🎻', '🪕'],
  'Objects': ['📱', '💻', '⌚', '📷', '🎥', '📺', '🎮', '🕹️', '🎧', '🎤', '🎵', '🎶', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🎻', '🪕', '📚', '📖', '📝', '✏️', '🖍️', '🖊️', '🖋️', '✒️', '🖌️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🗃️', '🗂️', '📂', '📁', '🗄️', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', '🔩', '⚙️', '🧰', '🪜', '🪣', '🧽', '🧼', '🪥', '🪒', '🔍', '🪞', '🪟', '🛏️', '🪑', '🚪', '🧸', '🎁', '🎀', '🪩', '🎊', '🎉'],
  'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚡', '💫', '⭐', '🌟', '✨', '☄️', '💥', '🔥', '🌈', '☀️', '🌞', '🌙', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '☁️', '⛅', '⛈️', '🌤️', '🌦️', '🌧️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '☂️', '☔', '💧', '💦', '🌊', '✅', '❌', '⭕', '🛑', '⛔', '📵', '🚫', '💯', '💢', '♨️', '💤', '🕳️', '💣', '💬', '👁️‍🗨️', '💭', '🗯️'],
  'Buildings': ['🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏬', '💒', '🏛️', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '💃', '🎢', '🎡', '🎈'],
  'Numbers': ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '#️⃣', '*️⃣'],
  'Colours': ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '🔶', '🔷', '🔸', '🔹'],
  'Gender & Sexuality': ['♂️', '♀️', '⚥', '⚧', '⚦', '⚤', '⚣', '⚢', '⚲', '⚪', '☿', '🚹', '🚺', '🚻', '△', '▽', '□', '○', '🏳️‍⚧️', '🏳️‍🌈', '👨', '👩', '🧑', '👦', '👧', '🧒', '👤', '👥', '🫅', '👑'],
  'Miscellaneous': ['♻️', '🔄', '🔁', '🔂', '⏩', '⏪', '⏫', '⏬', '◀️', '▶️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔤', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '💣', '🪃', '🏹', '🛡️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🪝', '🧰', '🧲', '🪜', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💊', '🩸', '🩹', '🩼', '🩺', '🪶']
};

// Helper functions to create categories from presets
export function createCategoriesFromPreset(presetKey: keyof typeof CATEGORY_PRESETS): ProfileCategory[] {
  const preset = CATEGORY_PRESETS[presetKey];
  return preset.categories.map((category, index) => ({
    id: `category-${index + 1}`,
    name: category.name,
    description: category.description,
    icon: category.icon,
    color: DEFAULT_SLICE_COLORS[index % DEFAULT_SLICE_COLORS.length],
  }));
}

// Convenience functions for specific presets
export function createDefaultCategories(): ProfileCategory[] {
  return createCategoriesFromPreset(DEFAULT_PRESET_KEY);
}

export function createSensoryCategories(): ProfileCategory[] {
  return createCategoriesFromPreset('sensory');
}

// Get list of available presets
export function getAvailablePresets(): Array<{ key: string; name: string; description: string }> {
  return Object.entries(CATEGORY_PRESETS).map(([key, preset]) => ({
    key,
    name: preset.name,
    description: preset.description,
  }));
}

// Get the default categories (alias for convenience)
export function getDefaultCategories(): ProfileCategory[] {
  return createDefaultCategories();
}
