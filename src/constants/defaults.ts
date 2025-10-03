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

export const SENSORY_SLICE_DESCRIPTIONS = [
  'Your unique response to sound. A low score indicates you can generally filter background noise and tolerate everyday sounds. A high score reflects extreme sensitivity (hyper), where common noises are painful or overwhelming, or under-sensitivity (hypo), where you might seek out loud, intense sounds to feel regulated.',
  'Your ability to perceive signals from inside your body. A low score means you reliably notice internal cues like hunger, thirst, or pain. A high score reflects difficulty recognising these signals, which can lead to not eating until famished, not drinking until dehydrated, or not identifying emotions until they become overwhelming.',
  'Your experience of the visual world. A low score suggests you handle typical lighting and visual clutter comfortably. A high score can mean hypersensitivity, where bright lights or busy patterns are disorienting, or hyposensitivity, where you might be drawn to intense visual stimuli like flashing lights to feel engaged.',
  'Your sensitivity and reaction to different scents. A low score means you notice smells but are not typically overwhelmed. A high score can indicate hypersensitivity, where common smells like perfume or food are nauseating, or hyposensitivity, where you might not notice strong odours or may actively seek them out.',
  'Your sensitivity to flavours and textures in your mouth. A low score means you enjoy a varied diet without issue. A high score can mean hypersensitivity leading to a restricted diet where certain textures are unbearable, or hyposensitivity where you crave extremely strong flavours (e.g., very spicy or sour) to register the taste.',
  'Your experience of physical contact and textures on your skin. A low score indicates comfort with varied clothing, temperatures, and types of touch. A high score can mean hypersensitivity, making clothing tags or light touch feel painful, or hyposensitivity, where you might not notice pain or may seek deep pressure to feel calm.',
  'Your internal sense of balance, movement, and spatial orientation. A low score suggests you feel stable and coordinated. A high score might reflect hypersensitivity, causing motion sickness from small movements, or hyposensitivity, leading to a need for intense movement like spinning or rocking to feel regulated.',
  'Your brain\'s unconscious awareness of where your body is in space. A low score means you move with confidence and rarely misjudge force. A high score can manifest as clumsiness, bumping into objects, or using too much or too little force (e.g., writing too hard or holding things too loosely), often seeking deep pressure to get a better sense of your body.'
];

export const SENSORY_SLICE_LABELS = [
  'Sound (Auditory)',
  'Internal Sensations (Interoception)',
  'Sight (Visual)',
  'Smell (Olfactory)',
  'Taste (Gustatory)',
  'Touch (Tactile)',
  'Balance (Vestibular)',
  'Body Awareness (Proprioception)'
];

export const SENSORY_SLICE_ICONS = [
  '👂','👁️','✋','💝','👃','👅','🤸‍♀','🚶‍♂️'
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

export const DEFAULT_SLICE_DESCRIPTIONS = [
  'The way the brain processes sensory information such as sound, light, touch, taste, smell, movement, and body awareness. A low score suggests comfort and typical responses to sensory input. A high score indicates significant challenges with over- or under-responsiveness to sensory stimuli, potentially causing distress, avoidance, or behavioral responses.',
  'The energy and comfort involved in connecting with others. A low score suggests fulfilling social connections with minimal strain. A high score reflects profound difficulty or exhaustion from social demands, leading to isolation, burnout, or a complete inability to engage, requiring significant support to maintain relationships.',
  'The use of spoken language to express thoughts, needs, and emotions. A low score indicates clear, effective verbal communication with ease. A high score suggests significant challenges in expressing oneself verbally, potentially requiring alternative communication methods or causing frequent misunderstandings.',
  'Communication through body language, facial expressions, gestures, and tone of voice. A low score means natural, intuitive use of non-verbal cues. A high score indicates difficulty interpreting or using non-verbal communication, leading to misunderstandings, social awkwardness, or reliance on explicit verbal communication.',
  'The mental skills needed for planning, organizing, time management, and task completion. A low score suggests strong organizational and planning abilities. A high score indicates significant challenges with executive functions, affecting daily tasks, work performance, and independent living skills.',
  'The ability to recognize, understand, and manage emotions appropriately. A low score suggests stable emotional responses and effective coping strategies. A high score indicates intense emotional experiences, frequent overwhelm, difficulty with emotional regulation, or emotional shutdowns that significantly impact daily functioning.',
  'The ability to adapt thinking and behavior when situations change or when faced with new information. A low score indicates easy adaptation to change and flexible thinking. A high score suggests significant difficulty with transitions, strong need for routine, and distress when expectations are not met.',
  'Physical coordination and movement abilities, including both fine and gross motor skills. A low score indicates typical motor development and coordination. A high score suggests significant challenges with motor planning, coordination, or physical activities that may affect daily living skills and participation in activities.',
  'The need for consistent patterns, schedules, and predictable environments. A low score suggests comfort with spontaneity and change. A high score indicates a strong reliance on routine and predictability, with significant distress or dysfunction when routines are disrupted.',
  'Intense, focused interests in specific topics, activities, or objects. A low score suggests typical, varied interests. A high score indicates highly focused, possibly restrictive interests that may dominate time and attention, potentially interfering with other activities or social interactions.'
];

export const DEFAULT_SLICE_ICONS = [
  '💏', '🗨️', '👂', '👋', '🔍', '🏠', '😰', '♻️', '📚', '🤸‍♀️'
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

