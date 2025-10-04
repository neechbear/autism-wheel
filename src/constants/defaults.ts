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

export const SENSORY_SLICE_DESCRIPTIONS = [
  'Your unique response to sound. A low score indicates you can generally filter background noise and tolerate everyday sounds. A high score reflects extreme sensitivity (hyper), where common noises are painful or overwhelming, or under-sensitivity (hypo), where you might seek out loud, intense sounds to feel regulated.',
  'Your experience of the visual world. A low score suggests you handle typical lighting and visual clutter comfortably. A high score can mean hypersensitivity, where bright lights or busy patterns are disorienting, or hyposensitivity, where you might be drawn to intense visual stimuli like flashing lights to feel engaged.',
  'Your sensitivity and reaction to different scents. A low score means you notice smells but are not typically overwhelmed. A high score can indicate hypersensitivity, where common smells like perfume or food are nauseating, or hyposensitivity, where you might not notice strong odours or may actively seek them out.',
  'Your experience of physical contact and textures on your skin. A low score indicates comfort with varied clothing, temperatures, and types of touch. A high score can mean hypersensitivity, making clothing tags or light touch feel painful, or hyposensitivity, where you might not notice pain or may seek deep pressure to feel calm.',
  'Your sensitivity to flavours and textures in your mouth. A low score means you enjoy a varied diet without issue. A high score can mean hypersensitivity leading to a restricted diet where certain textures are unbearable, or hyposensitivity where you crave extremely strong flavours (e.g., very spicy or sour) to register the taste.',
  'Your ability to perceive signals from inside your body. A low score means you reliably notice internal cues like hunger, thirst, or pain. A high score reflects difficulty recognising these signals, which can lead to not eating until famished, not drinking until dehydrated, or not identifying emotions until they become overwhelming.',
  'Your internal sense of balance, movement, and spatial orientation. A low score suggests you feel stable and coordinated. A high score might reflect hypersensitivity, causing motion sickness from small movements, or hyposensitivity, leading to a need for intense movement like spinning or rocking to feel regulated.',
  'Your brain\'s unconscious awareness of where your body is in space. A low score means you move with confidence and rarely misjudge force. A high score can manifest as clumsiness, bumping into objects, or using too much or too little force (e.g., writing too hard or holding things too loosely), often seeking deep pressure to get a better sense of your body.'
];

export const SENSORY_SLICE_LABELS = [
  'Sound (Auditory)',
  'Sight (Visual)',
  'Smell (Olfactory)',
  'Touch (Tactile)',
  'Taste (Gustatory)',
  'Internal Sensations (Interoception)',
  'Balance (Vestibular)',
  'Body Awareness (Proprioception)'
];

export const SENSORY_SLICE_ICONS = [
  '👂','👁️','👃','✋','👅','💝','🤸‍♀','🚶‍♂️'
]

export const DEFAULT_SLICE_LABELS = [
  'Social Interaction & Relationships',
  'Communication Differences',
  'Sensory Experiences',
  'Stimming & Self-Regulation',
  'Passionate Interests',
  'Executive Functioning',
  'Emotional Experiences & Regulation',
  'Need for Predictability & Routine',
  'Cognitive Profile & Learning Style',
  'Motor Skills & Coordination'
];

export const DEFAULT_SLICE_ICONS = [
  '💏', '🗨️', '👂', '👋', '🔍', '🏠', '😰', '♻️', '📚', '🤸‍♀️'
];

export const DEFAULT_SLICE_DESCRIPTIONS = [
  'The energy and comfort involved in connecting with others. A low score suggests fulfilling social connections with minimal strain. A high score reflects profound difficulty or exhaustion from social demands, leading to isolation, burnout, or a complete inability to engage, requiring significant support to maintain relationships.',
  'How you understand and express information. A low score means easy, fluid communication in your preferred style. A high score reflects significant challenges, such as being non-speaking, experiencing situational mutism, or having profound difficulty processing verbal language, requiring AAC or other extensive supports.',
  'Your unique sensory landscape. A low score indicates manageable sensitivities or a balanced sensory profile. A high score means extreme hyper- or hyposensitivities that are disabling, causing severe distress, sensory overload, or making it impossible to navigate everyday environments without extensive accommodations.',
  'The use of self-regulatory actions to manage internal states. A low score suggests stimming is a gentle, effective tool for comfort. A high score indicates a constant, intense need for regulation, or the presence of harmful stims (e.g., head-banging) in response to extreme distress, requiring intervention for safety.',
  'The intensity and role of deep, focused interests. A low score reflects enjoyable hobbies that are easily balanced with other life demands. A high score indicates an all-consuming, monotropic focus that is essential for well-being but can make it extremely difficult to shift attention to other critical life tasks.',
  'The mental energy for planning, starting, and organizing tasks. A low score means these processes are relatively smooth. A high score reflects profound challenges like autistic inertia, time blindness, and difficulty with self-care, making independent living nearly impossible without constant structure and support.',
  'The intensity of your emotions and the effort needed to manage them. A low score indicates a manageable emotional landscape. A high score reflects intensely felt emotions, frequent dysregulation, alexithymia, or debilitating meltdowns/shutdowns that severely impact daily life and require a highly supportive environment.',
  'The level of reliance on structure to feel safe and regulated. A low score suggests a preference for routine but with easy flexibility. A high score indicates a profound need for sameness, where even minor changes cause extreme distress, anxiety, or a meltdown, requiring a highly controlled and predictable environment.',
  'Your distinct way of thinking and learning. A low score means your learning style is easily accommodated. A high score reflects a significant mismatch with standard educational or work environments, or the presence of a co-occurring intellectual disability, requiring highly specialized and individualized support to learn.',
  'The connection between mind and body for movement. A low score suggests fluid motor skills. A high score reflects significant dyspraxia, poor balance, or challenges with fine/gross motor skills that impact independence in daily tasks like dressing or writing, and may lead to conditions like autistic catatonia.'
];

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

// Helper function to create default categories from arrays
export const createDefaultCategories = (): ProfileCategory[] => {
  return DEFAULT_SLICE_LABELS.map((label, index) => ({
    id: `default-${index}`,
    name: label,
    description: DEFAULT_SLICE_DESCRIPTIONS[index] || `Description for ${label}`,
    icon: DEFAULT_SLICE_ICONS[index] || '❓',
    color: DEFAULT_SLICE_COLORS[index] || '#e2e8f0'
  }));
};

// Helper function to create sensory categories from arrays
export const createSensoryCategories = (): ProfileCategory[] => {
  return SENSORY_SLICE_LABELS.map((label, index) => ({
    id: `sensory-${index}`,
    name: label,
    description: SENSORY_SLICE_DESCRIPTIONS[index] || `Description for ${label}`,
    icon: SENSORY_SLICE_ICONS[index] || '❓',
    color: DEFAULT_SLICE_COLORS[index] || '#e2e8f0' // Use default colors as specified
  }));
};
