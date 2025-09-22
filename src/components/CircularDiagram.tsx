import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { Trash2, GripVertical, Plus, ChevronDown, ChevronUp, Settings, Smile, Printer, Link } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LZString from 'lz-string';

// YouTube icon component
function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
    >
      <path
        fill="#FF0000"
        d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"
      />
      <path fill="#FFF" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

interface Selection {
  [sliceIndex: number]: number[];
}

const TOTAL_RINGS = 10;
const TOTAL_SLICES = 10;
const CENTER_X = 375;
const CENTER_Y = 375;
const MIN_RADIUS = 55;
const MAX_RADIUS = 265;
const RING_WIDTH = (MAX_RADIUS - MIN_RADIUS) / TOTAL_RINGS;

const INITIAL_SLICE_LABELS = [
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

const INITIAL_SLICE_DESCRIPTIONS = [
  'Describes an individual\'s unique way of interacting with others. This includes preferences for group sizes, ways of showing interest, and understanding of non-verbal cues. Autistic communication styles are different from non-autistic styles, not inherently deficient.',
  'Covers the diverse ways an individual expresses themselves and processes information. This includes verbal speech, non-speaking communication (e.g., AAC), literal interpretation of language, processing time needed, and use of echolalia (repeating words/phrases).',
  'Relates to how an individual experiences the world through their senses. This can include being hypersensitive (overwhelmed by sounds, lights, textures) or hyposensitive (seeking out strong sensory input) across sight, hearing, touch, taste, smell, balance, and body awareness.',
  'Describes self-regulatory body movements (e.g., hand-flapping, rocking, vocalizing, comforters) used to manage sensory input, express emotions, and maintain focus and calm.',
  'Describes a deep, focused engagement in specific topics that provides joy, expertise, and a sense of purpose. This is a natural and positive aspect of autistic identity.',
  'Refers to the mental processes that help with planning, organizing, starting tasks (overcoming inertia), managing time, and shifting focus. Differences in executive functioning are a common aspect of neurodivergence and are not a reflection of character or effort.',
  'Describes an individual\'s emotional landscape and the strategies they use to manage it. Autistic people may experience emotions very intensely. Dysregulation is often a response to sensory or emotional overload, and regulation is achieved through strategies like stimming or reducing demands.',
  'Highlights the importance of structure and predictability in daily life. Routines help reduce anxiety, manage sensory input, and conserve cognitive energy in a world that can feel chaotic and overwhelming. This is a key coping strategy, not a sign of inflexibility.',
  'Describes an individual\'s unique way of thinking, processing information, and learning. Autistic people often have distinct learning styles (e.g., visual, kinesthetic, logical) and cognitive strengths, such as strong rote memory, pattern recognition, or deep focus. This is about a different way of thinking, not a deficient one.',
  'Covers differences in both fine motor skills (e.g., handwriting, buttoning clothes) and gross motor skills (e.g., balance, coordination in sports). Many autistic people experience differences in motor planning and execution (sometimes called dyspraxia), which is a natural variation in physical development.'
];

const INITIAL_SLICE_ICONS = [
  '💏',
  '🗨️',
  '👂',
  '👋',
  '🔍',
  '🏠',
  '😰',
  '🔄',
  '📚',
  '🤸‍♀️'
];

// Common emoji categories for the picker
const EMOJI_CATEGORIES = {
  'People': ['😀', '😊', '🥰', '😎', '🤔', '😰', '😭', '🥱', '😴', '🤗', '🤓', '😇', '🙂', '😉', '😍', '🤩', '😘', '😗', '☺️', '😚', 'ksz', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤭', '🤫', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😷', 'tery', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '🧐'],
  'Body Parts': ['👁️', '👀', '👂', '👃', '👄', '👅', '🦷', '🧠', '🫀', '🫁', '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧓', '👴', '👵', '👤', '👥', '🗣️', '👣', '🦴', '🦵', '🦶', '💪', '🤳', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤝', '👍', '👎', '👊', '✊', ' Lars', '🤜', '👏', '🙌', 'ONES', '🙏'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', 'wolf', '🐗', '🐴', '🦄', '🐝', '🪲', '🐛', '🦋', '🐌', '🐞', '蚂蚁', '🪱', '🦗', '🕷️', '🦂', 'turtle', 'snake', ' lizard', '🦖', '🦕', 'octopus', 'squid', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', 'camel', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', 'deer', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛'],
  'Food': ['🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', 'pineapple', ' coconut', 'kiwi', 'tomato', 'eggplant', 'avocado', '🥦', '🥬', '🥒', '🌶️', '🫑', 'corn', 'carrot', '🫒', '🧄', '🧅', 'potato', 'sweet potato', '🥐', '🥖', 'bread', '🥨', '🥯', '🥞', '🧇', 'cheese', 'meat', 'poultry', 'veal', 'bacon', 'burger', 'fries', 'taco', 'burrito', '🫔', '🥙', '🧆', 'egg', 'cook', 'soup', '🫕', 'salad', 'popcorn', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', 'sweet potato', 'oden', '🍣', '🍤', '🍥', 'mooncake', '🥟', 'fortune', '🥡', '🦪', 'ice cream', 'cream', 'cake', 'cupcake', 'pie', '🥧', 'chocolate', 'candy', 'lollipop', 'caramel', 'honey', '🍼', 'milk', '☕', '🫖', 'tea', '🍶', '🍾', 'wine', 'cocktail', '🍹', 'beer', '🍻', '🥂', '🥃', '🫗', 'drink', '🧋', '🧃', '🧉', 'ice'],
  'Medical & Therapy': ['🏥', '⚕️', '🩺', 'pill', 'needle', '🩹', '🩼', '🦽', '🦼', '🧑‍⚕️', '👨‍⚕️', '👩‍⚕️', '🧬', 'microbe', '🧪', '🔬', '🌡️', '🩸', '🫁', 'brain', '🫀', '🦴', '👁️‍🗨️', '🗨️', '💬', '🗣️', '👂', '👁️', '🔍', '🔎', '📋', '📝', '📊', '📈', '📉', '🎯', '🧩', 'dice', '🃏', '🎴', '🀄'],
  'Gestures': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', ' Lars', '🤜', '👏', '🙌', '.openg', 'parer', '🤝', '🙏'],
  'Activities': ['🤸‍♂️', '🤸‍♀', '🏃‍♀️', '🏃‍♂️', '🚶‍♀️', '🚶‍♂️', '🧘‍♀️', '🧘‍♂️', '🏋️‍♀️', '🏋️‍♂️', '🤾‍♀️', '🤾‍♂️', '🏌️‍♀️', '🏌️‍♂️', '🏄‍♀️', '🏄‍♂️', '🚣‍♀️', '🚣‍♂️', '🏊‍♀️', '🏊‍♂️', '⛹️‍♀️', '⛹️‍♂️', 'horse', '🧗‍♀️', '🧗‍♂️', '🚴‍♀️', '🚴‍♂️', '🤹‍♀️', '🤹‍♂️', '🎭', '🎨', '🎪', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥁', '🎹', ' guitar', ' trumpet', ' saxophone', ' violin', '🪕'],
  'Objects': ['📱', '💻', '⌚', '📷', '🎥', '📺', '🎮', '🕹️', '🎧', '🎤', '🎵', '🎶', '🎼', '🎹', '🥁', 'saxophone', ' trumpet', ' guitar', ' violin', '🪕', '📚', '📖', '📝', '✏️', '🖍️', '🖊️', '🖋️', '✒️', '🖌️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🗃️', '🗂️', '📂', '📁', '🗄️', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', 'nuts', '⚙️', '🧰', '🪜', '🪣', '🧽', '🧼', '🪥', '🪒', '🔍', '🪞', '🪟', '🛏️', '🪑', '🚪', 'toy', 'gift', 'ribbon', '🪩', '🎊', '🎉'],
  'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '-ms', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚡', '💫', '⭐', '🌟', '✨', '☄️', '💥', '🔥', '🌈', '☀️', '🌞', '🌙', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '☁️', '⛅', '⛈️', '🌤️', '🌦️', '🌧️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '☂️', '☔', '💧', '💦', '🌊', '✅', '❌', '⭕', '🛑', '⛔', '📵', '🚫', '💯', '💢', '♨️', '💤', '🕳️', 'bomb', '💬', '👁️‍🗨️', '💭', '🗯️'],
  'Buildings': ['🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '.Logf', '💒', '🏛️', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', 'carousel', 'dance', 'roller', 'blade', 'celebration'],
  'Misc': ['♻️', '🔄', '🔁', '🔂', '⏩', '⏪', '⏫', '⏬', '◀️', '▶️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', 'uffs', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', 'bomb', '🪃', 'arrow', 'shield', '🪚', '🔧', '🪛', 'nuts', '⚙️', '🗜️', '⚖️', '🦯', '🔗', 'chains', '🪝', '🧰', 'magnet', '🪜', 'alchemy', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', 'pill', '🩸', '🩹', '🩼', '🩺', '🪶']
};

const INITIAL_SLICE_COLORS = [
  '#3B82F6', // blue
  '#10B981', // emerald
  '#F59E0B', // amber
  '#EF4444', // red
  '#8B5CF6', // violet
  '#06B6D4', // cyan
  '#84CC16', // lime
  '#F97316', // orange
  '#EC4899', // pink
  '#14B8A6', // teal
];

interface LabelData {
  id: string;
  label: string;
  color: string;
  icon: string;
  description: string;
  originalIndex: number;
}

// Helper function to darken a hex color
const darkenColor = (hexColor: string, amount: number = 0.3): string => {
  // Remove the # if present
  const color = hexColor.replace('#', '');
  
  // Parse the RGB values
  const num = parseInt(color, 16);
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  
  // Darken each component
  const darkenedR = Math.floor(r * (1 - amount));
  const darkenedG = Math.floor(g * (1 - amount));
  const darkenedB = Math.floor(b * (1 - amount));
  
  // Convert back to hex
  return `#${((darkenedR << 16) | (darkenedG << 8) | darkenedB).toString(16).padStart(6, '0')}`;
};

const ItemTypes = {
  LABEL_ROW: 'labelRow',
};

interface DraggableLabelRowProps {
  labelData: LabelData;
  index: number;
  editingLabels: LabelData[];
  setEditingLabels: React.Dispatch<React.SetStateAction<LabelData[]>>;
  onDelete: (id: string) => void;
  canDelete: boolean;
}

function EmojiPicker({ selectedEmoji, onEmojiSelect }: { selectedEmoji: string; onEmojiSelect: (emoji: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="w-12 h-8 p-0 text-lg inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground">
          {selectedEmoji || <Smile className="w-4 h-4" />}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4 max-h-96" align="start">
        <div className="space-y-3 max-h-80 overflow-y-auto overflow-x-hidden emoji-picker-scroll">
          {Object.entries(EMOJI_CATEGORIES).map(([category, emojis]) => (
            <div key={category}>
              <h4 className="text-sm font-medium mb-2 sticky top-0 bg-popover pr-4">{category}</h4>
              <div className="grid grid-cols-8 gap-1 pr-2">
                {emojis.map((emoji, index) => (
                  <button
                    key={`${category}-${emoji}-${index}`}
                    onClick={() => {
                      onEmojiSelect(emoji);
                      setIsOpen(false);
                    }}
                    className="w-8 h-8 flex items-center justify-center text-lg hover:bg-accent rounded border-0 bg-transparent flex-shrink-0"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

function DraggableLabelRow({ labelData, index, editingLabels, setEditingLabels, onDelete, canDelete }: DraggableLabelRowProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const dropRef = useRef<HTMLTableRowElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.LABEL_ROW,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isOver }, drop] = useDrop({
    accept: ItemTypes.LABEL_ROW,
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        const newLabels = [...editingLabels];
        const draggedItem = newLabels[item.index];
        newLabels.splice(item.index, 1);
        newLabels.splice(index, 0, draggedItem);
        setEditingLabels(newLabels);
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  // Apply drag to the grip handle and drop to the entire row
  React.useEffect(() => {
    if (dragRef.current) {
      drag(dragRef.current);
    }
    if (dropRef.current) {
      drop(dropRef.current);
    }
  }, [drag, drop]);

  const handleLabelChange = (newLabel: string) => {
    const newLabels = [...editingLabels];
    newLabels[index] = { ...newLabels[index], label: newLabel };
    setEditingLabels(newLabels);
  };

  const handleColorChange = (newColor: string) => {
    const newLabels = [...editingLabels];
    newLabels[index] = { ...newLabels[index], color: newColor };
    setEditingLabels(newLabels);
  };

  const handleIconChange = (newIcon: string) => {
    const newLabels = [...editingLabels];
    newLabels[index] = { ...newLabels[index], icon: newIcon };
    setEditingLabels(newLabels);
  };

  const handleDescriptionChange = (newDescription: string) => {
    const newLabels = [...editingLabels];
    newLabels[index] = { ...newLabels[index], description: newDescription };
    setEditingLabels(newLabels);
  };

  return (
    <tr
      ref={dropRef}
      className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
      style={{ 
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.1)' : 'transparent'
      }}
    >
      <TableCell>
        <EmojiPicker
          selectedEmoji={labelData.icon}
          onEmojiSelect={handleIconChange}
        />
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Input
            value={labelData.label}
            onChange={(e) => handleLabelChange(e.target.value)}
            className="border-none p-0 focus-visible:ring-0"
            placeholder="Label name..."
          />
          <Textarea
            value={labelData.description}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            className="border-none p-0 focus-visible:ring-0 text-sm resize-none"
            placeholder="Enter description..."
            rows={3}
          />
        </div>
      </TableCell>
      <TableCell>
        <input
          type="color"
          value={labelData.color}
          onChange={(e) => handleColorChange(e.target.value)}
          className="w-8 h-8 border-none cursor-pointer rounded"
        />
      </TableCell>
      <TableCell>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(labelData.id)}
          disabled={!canDelete}
          className={canDelete 
            ? "text-destructive hover:text-destructive hover:bg-destructive/10" 
            : "text-muted-foreground cursor-not-allowed"
          }
          title={!canDelete ? "Cannot delete - minimum of 2 labels required" : "Delete label"}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </TableCell>
      <TableCell>
        <div ref={dragRef} className="cursor-move p-1 hover:bg-muted rounded">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
      </TableCell>
    </tr>
  );
}

function CircularDiagramContent() {
  const [selections, setSelections] = useState<Selection>({});
  const [sliceLabels, setSliceLabels] = useState<string[]>(INITIAL_SLICE_LABELS);
  const [sliceColors, setSliceColors] = useState<string[]>(INITIAL_SLICE_COLORS);
  const [sliceIcons, setSliceIcons] = useState<string[]>(INITIAL_SLICE_ICONS);
  const [sliceDescriptions, setSliceDescriptions] = useState<string[]>(INITIAL_SLICE_DESCRIPTIONS);
  const [isEditingLabels, setIsEditingLabels] = useState(false);
  const [editingLabels, setEditingLabels] = useState<LabelData[]>([]);
  const [originalEditingLabels, setOriginalEditingLabels] = useState<LabelData[]>([]);
  const [newLabelText, setNewLabelText] = useState('');
  const [newLabelIcon, setNewLabelIcon] = useState('😀');
  const [numberPosition, setNumberPosition] = useState<'left' | 'center' | 'right' | 'hidden'>('center');
  const [labelStyle, setLabelStyle] = useState<'normal' | 'bold' | 'hidden'>('normal');
  const [boundaryWeight, setBoundaryWeight] = useState<'normal' | 'bold' | 'hidden'>('bold');
  const [showIcons, setShowIcons] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState<'category' | 'typical' | 'stress' | null>('stress');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [theme, setTheme] = useState<'system' | 'light' | 'dark'>('system');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Helper function to determine if dark mode is active
  const checkDarkMode = () => {
    if (theme === 'dark') {
      return true;
    } else if (theme === 'light') {
      return false;
    } else { // system
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
  };

  // Update isDarkMode state whenever theme changes
  useEffect(() => {
    setIsDarkMode(checkDarkMode());
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => setIsDarkMode(checkDarkMode());
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Apply theme changes to document
  useEffect(() => {
    const applyTheme = () => {
      const root = document.documentElement;
      
      if (theme === 'dark') {
        root.classList.add('dark');
      } else if (theme === 'light') {
        root.classList.remove('dark');
      } else { // system
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      }
    };

    applyTheme();

    // Listen for system theme changes when using system theme
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => applyTheme();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const handleSegmentClick = (sliceIndex: number, ringIndex: number) => {
    setSelections(prev => {
      const currentSelections = prev[sliceIndex] || [];
      const segmentNumber = ringIndex + 1; // Convert to 1-based numbering
      
      if (currentSelections.length === 0) {
        // No current selections, add this one
        return {
          ...prev,
          [sliceIndex]: [segmentNumber]
        };
      } else if (currentSelections.length === 1) {
        const [firstSelection] = currentSelections;
        
        if (segmentNumber <= firstSelection) {
          // Clicked on a dark-colored segment, clear all selections
          return {
            ...prev,
            [sliceIndex]: []
          };
        } else {
          // Clicked on an uncolored segment, add as second selection
          return {
            ...prev,
            [sliceIndex]: [firstSelection, segmentNumber].sort((a, b) => a - b)
          };
        }
      } else if (currentSelections.length === 2) {
        const [first, second] = currentSelections;
        
        if (segmentNumber <= first) {
          // Clicked on a dark-colored segment, clear all selections
          return {
            ...prev,
            [sliceIndex]: []
          };
        } else if (segmentNumber <= second) {
          // Clicked on a light-colored segment, remove second selection
          return {
            ...prev,
            [sliceIndex]: [first]
          };
        } else {
          // Clicked on an uncolored segment, do nothing (already have 2 selections)
          return prev;
        }
      }
      
      return prev;
    });
  };

  const getSegmentFill = (sliceIndex: number, ringIndex: number) => {
    const currentSelections = selections[sliceIndex] || [];
    const segmentNumber = ringIndex + 1;
    const baseColor = sliceColors[sliceIndex];
    
    if (currentSelections.length === 0) {
      return 'rgba(0, 0, 0, 0.05)';
    }
    
    if (currentSelections.length === 1) {
      const selectedSegment = currentSelections[0];
      if (segmentNumber <= selectedSegment) {
        return baseColor;
      }
    } else if (currentSelections.length === 2) {
      const [first, second] = currentSelections;
      if (segmentNumber <= first) {
        return baseColor;
      } else if (segmentNumber <= second) {
        // Lighter shade for the second range
        return baseColor + '80'; // 50% opacity
      }
    }
    
    return 'rgba(0, 0, 0, 0.05)';
  };

  const createSegmentPath = (sliceIndex: number, ringIndex: number) => {
    const angleStep = (2 * Math.PI) / sliceLabels.length;
    const startAngle = sliceIndex * angleStep - Math.PI / 2; // Start from top
    const endAngle = startAngle + angleStep;
    
    const innerRadius = MIN_RADIUS + ringIndex * RING_WIDTH;
    const outerRadius = MIN_RADIUS + (ringIndex + 1) * RING_WIDTH;
    
    const x1 = CENTER_X + innerRadius * Math.cos(startAngle);
    const y1 = CENTER_Y + innerRadius * Math.sin(startAngle);
    const x2 = CENTER_X + outerRadius * Math.cos(startAngle);
    const y2 = CENTER_Y + outerRadius * Math.sin(startAngle);
    
    const x3 = CENTER_X + outerRadius * Math.cos(endAngle);
    const y3 = CENTER_Y + outerRadius * Math.sin(endAngle);
    const x4 = CENTER_X + innerRadius * Math.cos(endAngle);
    const y4 = CENTER_Y + innerRadius * Math.sin(endAngle);
    
    const largeArcFlag = angleStep > Math.PI ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      L ${x2} ${y2}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x3} ${y3}
      L ${x4} ${y4}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x1} ${y1}
      Z
    `;
  };

  const getLabelPosition = (sliceIndex: number) => {
    const angleStep = (2 * Math.PI) / sliceLabels.length;
    const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2; // Center of slice
    const labelRadius = MAX_RADIUS + 30;
    
    const x = CENTER_X + labelRadius * Math.cos(angle);
    const y = CENTER_Y + labelRadius * Math.sin(angle);
    
    return { x, y, angle };
  };

  const saveDiagramAs = (format: 'png' | 'svg' | 'jpeg' | 'html') => {
    if (!svgRef.current) return;

    if (format === 'html') {
      setTimeout(() => {
        try {
          // 1. Clone the entire document to avoid modifying the live DOM
          const clonedDocument = document.cloneNode(true) as Document;

          // 2. Clean up attributes that might interfere with the saved page's functionality
          const root = clonedDocument.querySelector('#root');
          const body = clonedDocument.body;
          const html = clonedDocument.documentElement;

          // Remove Radix UI temporary items that can interfere with layout and interaction
          clonedDocument.querySelectorAll('[data-radix-focus-guard],[data-radix-scroll-area-viewport]').forEach(el => el.remove());

          // Clean attributes from major elements that can lock scrolling or hide content
          [html, body, root].forEach(el => {
            if (!el) return;
            el.removeAttribute('data-scroll-locked');
            el.removeAttribute('data-aria-hidden');
            el.removeAttribute('aria-hidden');
            el.style.cssText = ''; // Remove inline styles that might be temporary
          });

          // 3. Serialize the cleaned DOM to a string
          // We add the doctype to ensure it's a valid HTML file
          let htmlString = '<!DOCTYPE html>' + clonedDocument.documentElement.outerHTML;

          // 4. Create and inject the state meta tag as a string
          // This is safer than injecting into the DOM before serialization
          const encodedState = encodeState();
          // Use single quotes for the content attribute for robustness
          const metaTag = `<meta name='autism-wheel-state' content='${encodedState}'>`;

          const headEndIndex = htmlString.indexOf('</head>');
          if (headEndIndex !== -1) {
            htmlString = htmlString.slice(0, headEndIndex) + metaTag + htmlString.slice(headEndIndex);
          }

          // 5. Create a blob and trigger the download
          const blob = new Blob([htmlString], { type: 'text/html;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = 'autismwheel.html';
          link.href = url;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);

        } catch (error) {
          console.error("Failed to save as HTML:", error);
          alert("Sorry, there was an error saving the file. Please try again.");
        }
      }, 150); // A small delay to allow UI to update (e.g., close dropdown)
      return;
    }

    if (format === 'svg') {
      // Create a new standalone SVG with proper attributes
      const svgClone = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('width', '750');
      svgClone.setAttribute('height', '750');
      svgClone.setAttribute('viewBox', '0 0 750 750');
      
      // Create background rectangle with theme-appropriate color
      const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      backgroundRect.setAttribute('x', '0');
      backgroundRect.setAttribute('y', '0');
      backgroundRect.setAttribute('width', '750');
      backgroundRect.setAttribute('height', '750');
      backgroundRect.setAttribute('fill', isDarkMode ? '#1f1f1f' : '#ffffff');
      svgClone.appendChild(backgroundRect);
      
      // Copy all elements from the original SVG
      const originalSvg = svgRef.current;
      for (let i = 0; i < originalSvg.children.length; i++) {
        const child = originalSvg.children[i];
        const clonedChild = child.cloneNode(true) as Element;
        
        // Ensure text elements have proper font styling
        if (clonedChild.tagName === 'text') {
          clonedChild.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
          clonedChild.setAttribute('font-size', '14');
          if (!clonedChild.getAttribute('fill')) {
            clonedChild.setAttribute('fill', '#374151');
          }
        }
        
        // Recursively fix text elements in groups
        const textElements = clonedChild.querySelectorAll('text');
        textElements.forEach(textEl => {
          textEl.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
          if (!textEl.getAttribute('font-size')) {
            textEl.setAttribute('font-size', '14');
          }
          if (!textEl.getAttribute('fill')) {
            textEl.setAttribute('fill', '#374151');
          }
        });
        
        svgClone.appendChild(clonedChild);
      }
      
      // Serialize the new SVG
      const svgData = new XMLSerializer().serializeToString(svgClone);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const link = document.createElement('a');
      link.download = 'autismwheel.svg';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      return;
    }

    // For PNG and JPEG, use canvas conversion
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to include space for labels that extend beyond the SVG
    const containerWidth = 750;
    const containerHeight = 750;
    canvas.width = containerWidth;
    canvas.height = containerHeight;

    // Set background color based on theme
    const backgroundColor = isDarkMode ? '#1f1f1f' : '#ffffff';
    if (format === 'jpeg') {
      // JPEG doesn't support transparency, so use theme-appropriate background
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, containerWidth, containerHeight);
    } else {
      // PNG supports transparency, but we'll use theme-appropriate background for consistency
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, containerWidth, containerHeight);
    }

    // Get SVG data
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    const img = new Image();
    
    img.onload = () => {
      // Draw the SVG onto the canvas
      ctx.drawImage(img, 0, 0);
      
      // Create download link
      const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
      const quality = format === 'jpeg' ? 0.9 : undefined; // High quality for JPEG
      
      canvas.toBlob((blob) => {
        if (!blob) return;
        
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `autismwheel.${format}`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, mimeType, quality);
    };

    // Convert SVG to data URL
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    img.src = svgUrl;
  };

  const handleEditLabels = () => {
    if (!isEditingLabels) {
      // Enter edit mode - create editing data from current labels
      const labelData = sliceLabels.map((label, index) => ({
        id: `label-${index}-${Date.now()}`,
        label,
        color: sliceColors[index],
        icon: sliceIcons[index] || '😀',
        description: sliceDescriptions[index],
        originalIndex: index // Store original index
      }));
      setEditingLabels(labelData);
      setOriginalEditingLabels(labelData);
      setIsEditingLabels(true);
    } else {
      // Save changes - need to remap selections based on new order
      const newLabels = editingLabels.map(item => item.label);
      const newColors = editingLabels.map(item => item.color);
      const newIcons = editingLabels.map(item => item.icon);
      const newDescriptions = editingLabels.map(item => item.description);
      
      // Create mapping from original indices to new indices
      const indexMapping: { [oldIndex: number]: number } = {};
      editingLabels.forEach((item, newIndex) => {
        indexMapping[item.originalIndex] = newIndex;
      });
      
      // Remap selections based on the new order
      setSelections(prev => {
        const newSelections: Selection = {};
        Object.keys(prev).forEach(key => {
          const oldSliceIndex = parseInt(key);
          const newSliceIndex = indexMapping[oldSliceIndex];
          
          // Only keep selections for labels that still exist and map them to new indices
          if (newSliceIndex !== undefined && newSliceIndex < newLabels.length) {
            newSelections[newSliceIndex] = prev[oldSliceIndex];
          }
        });
        return newSelections;
      });
      
      setSliceLabels(newLabels);
      setSliceColors(newColors);
      setSliceIcons(newIcons);
      setSliceDescriptions(newDescriptions);
      setIsEditingLabels(false);
    }
  };

  const handleRevertChanges = () => {
    setIsEditingLabels(false);
    setEditingLabels([]);
    setOriginalEditingLabels([]);
    setNewLabelText('');
    setNewLabelIcon('😀');
  };

  const handleDefaultLabels = () => {
    // Reset to hard-coded default values
    const defaultLabelData = INITIAL_SLICE_LABELS.map((label, index) => ({
      id: `label-${index}-${Date.now()}`,
      label,
      color: INITIAL_SLICE_COLORS[index],
      icon: INITIAL_SLICE_ICONS[index],
      description: INITIAL_SLICE_DESCRIPTIONS[index],
      originalIndex: index
    }));
    setEditingLabels(defaultLabelData);
  };

  // Check if editing labels have changed from original
  const hasChanges = () => {
    if (originalEditingLabels.length !== editingLabels.length) return true;
    
    return editingLabels.some((label, index) => {
      const original = originalEditingLabels[index];
      return !original || 
        label.label !== original.label ||
        label.color !== original.color ||
        label.icon !== original.icon ||
        label.description !== original.description;
    });
  };

  // Check if current labels match defaults
  const isAtDefaults = () => {
    if (editingLabels.length !== INITIAL_SLICE_LABELS.length) return false;
    
    return editingLabels.every((label, index) => 
      label.label === INITIAL_SLICE_LABELS[index] &&
      label.color === INITIAL_SLICE_COLORS[index] &&
      label.icon === INITIAL_SLICE_ICONS[index] &&
      label.description === INITIAL_SLICE_DESCRIPTIONS[index]
    );
  };

  const handleDeleteLabel = (id: string) => {
    // Prevent deletion if there are 2 or fewer labels
    if (editingLabels.length <= 2) {
      return;
    }
    setEditingLabels(prev => prev.filter(item => item.id !== id));
  };

  const handleAddLabel = () => {
    if (newLabelText.trim()) {
      const newLabel: LabelData = {
        id: `label-${Date.now()}`,
        label: newLabelText.trim(),
        color: '#3B82F6', // Default blue color
        icon: newLabelIcon,
        description: '',
        originalIndex: editingLabels.length // Maintain order of addition
      };
      setEditingLabels(prev => [...prev, newLabel]);
      setNewLabelText('');
      setNewLabelIcon('😀');
    }
  };

  const handleSort = (column: 'category' | 'typical' | 'stress') => {
    if (sortColumn === column) {
      // Toggle direction if same column
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new column and default to ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const getSortedTableData = () => {
    const tableData = sliceLabels.map((label, sliceIndex) => {
      const currentSelections = selections[sliceIndex] || [];
      const [firstSelection, secondSelection] = currentSelections.sort((a, b) => a - b);
      const baseColor = sliceColors[sliceIndex];
      const icon = sliceIcons[sliceIndex];
      
      return {
        sliceIndex,
        label,
        icon,
        baseColor,
        firstSelection,
        secondSelection: secondSelection || firstSelection // Use first if no second selection
      };
    });

    if (!sortColumn) return tableData;

    return tableData.sort((a, b) => {
      let comparison = 0;
      
      switch (sortColumn) {
        case 'category':
          comparison = a.label.localeCompare(b.label);
          break;
        case 'typical':
          // Handle cases where there's no selection (treat as 0 for sorting)
          const aTypical = a.firstSelection || 0;
          const bTypical = b.firstSelection || 0;
          comparison = aTypical - bTypical;
          break;
        case 'stress':
          // Handle cases where there's no selection (treat as 0 for sorting)
          const aStress = a.secondSelection || 0;
          const bStress = b.secondSelection || 0;
          comparison = aStress - bStress;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper function to get support needs text based on number
  const getSupportNeedsText = (number: number) => {
    if (number >= 1 && number <= 4) return "Occasional Support Needs";
    if (number >= 5 && number <= 7) return "Frequent Support Needs";
    if (number >= 8 && number <= 10) return "Consistent Support Needs";
    return "";
  };

  // Function to encode current state to URL parameters (with compression)
  const encodeState = () => {
    const state = {
      selections,
      sliceLabels,
      sliceColors,
      sliceIcons,
      sliceDescriptions,
      numberPosition,
      labelStyle,
      boundaryWeight,
      showIcons,
      sortColumn,
      sortDirection,
      theme
    };
    
    // Convert to JSON, compress, and encode for URL
    const jsonString = JSON.stringify(state);
    const compressedString = LZString.compressToBase64(jsonString);
    return compressedString;
  };

  // Function to decode state from URL parameters (with decompression and fallback)
  const decodeState = (encodedState: string) => {
    try {
      // First, try to decompress from Base64, which is the new default
      let decompressedString = LZString.decompressFromBase64(encodedState);
      if (decompressedString) {
        return JSON.parse(decompressedString);
      }

      // Fallback to the URI-encoded component format
      decompressedString = LZString.decompressFromEncodedURIComponent(encodedState);
      if (decompressedString) {
        return JSON.parse(decompressedString);
      }

      // Fallback to old, uncompressed base64 format for very old links
      const jsonString = decodeURIComponent(escape(atob(encodedState)));
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Failed to decode state:', error);
      return null;
    }
  };

  // Function to copy shareable link to clipboard (improved with better fallbacks)
  const handleCopyLink = async () => {
    const encodedState = encodeState();
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.set('state', encodedState);
    const urlString = currentUrl.toString();
    
    // Try multiple methods in order of preference
    let success = false;
    
    // Method 1: Modern Clipboard API (only if available and secure context)
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(urlString);
        alert('Link copied to clipboard!');
        return;
      } catch (error) {
        console.warn('Clipboard API failed:', error);
        // Continue to fallback methods
      }
    }
    
    // Method 2: execCommand fallback
    try {
      const tempTextArea = document.createElement('textarea');
      tempTextArea.value = urlString;
      tempTextArea.style.position = 'fixed';
      tempTextArea.style.left = '-9999px';
      tempTextArea.style.top = '-9999px';
      tempTextArea.style.opacity = '0';
      tempTextArea.style.pointerEvents = 'none';
      tempTextArea.setAttribute('readonly', '');
      tempTextArea.setAttribute('tabindex', '-1');
      
      document.body.appendChild(tempTextArea);
      
      // Focus and select the text
      tempTextArea.focus();
      tempTextArea.select();
      tempTextArea.setSelectionRange(0, tempTextArea.value.length);
      
      // For iOS devices
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        tempTextArea.contentEditable = 'true';
        tempTextArea.readOnly = false;
        const range = document.createRange();
        range.selectNodeContents(tempTextArea);
        const selection = window.getSelection();
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
        tempTextArea.setSelectionRange(0, 999999);
      }
      
      const successful = document.execCommand('copy');
      document.body.removeChild(tempTextArea);
      
      if (successful) {
        alert('Link copied to clipboard!');
        return;
      }
    } catch (error) {
      console.warn('execCommand fallback failed:', error);
    }
    
    // Method 3: Show in prompt for manual copying
    try {
      const message = 'Copy this link:';
      if (window.prompt) {
        const userAction = prompt(message, urlString);
        if (userAction !== null) {
          alert('Please copy the link from the dialog above.');
        }
        return;
      }
    } catch (error) {
      console.warn('Prompt method failed:', error);
    }
    
    // Method 4: Last resort - show in alert
    const alertMessage = `Please copy this link manually:\n\n${urlString}`;
    alert(alertMessage);
  };

  // Load state from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    let encodedState = urlParams.get('state');
    
    // If no state in URL, check for embedded meta tag
    if (!encodedState) {
      const metaTag = document.querySelector('meta[name="autism-wheel-state"]');
      if (metaTag) {
        encodedState = metaTag.getAttribute('content');
      }
    }

    if (encodedState) {
      const decodedState = decodeState(encodedState);
      if (decodedState) {
        // Apply the decoded state
        if (decodedState.selections) setSelections(decodedState.selections);
        if (decodedState.sliceLabels) setSliceLabels(decodedState.sliceLabels);
        if (decodedState.sliceColors) setSliceColors(decodedState.sliceColors);
        if (decodedState.sliceIcons) setSliceIcons(decodedState.sliceIcons);
        if (decodedState.sliceDescriptions) setSliceDescriptions(decodedState.sliceDescriptions);
        if (decodedState.numberPosition) setNumberPosition(decodedState.numberPosition);
        if (decodedState.labelStyle) setLabelStyle(decodedState.labelStyle);
        if (decodedState.boundaryWeight) setBoundaryWeight(decodedState.boundaryWeight);
        if (decodedState.showIcons !== undefined) setShowIcons(decodedState.showIcons);
        if (decodedState.sortColumn) setSortColumn(decodedState.sortColumn);
        if (decodedState.sortDirection) setSortDirection(decodedState.sortDirection);
        if (decodedState.theme) setTheme(decodedState.theme);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h1 className="mb-2 text-4xl font-bold">Autism Wheel</h1>
        
        <div className="mb-6 max-w-3xl mx-auto space-y-4">
          <p className="text-left">
            Hello! Thank you for using{' '}
            <a 
              href="https://neechbear.github.io/autism-wheel/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            >
              my Autism Wheel
            </a>
            . I developed this tool as a personal project to help individuals visualize and better understand their own unique autistic profiles. I am not a medical professional, and this tool is not intended for diagnosis, treatment, or as a replacement for professional medical advice. It is simply a resource for personal reflection. Always seek the guidance of a doctor or other qualified health professional with any questions you may have regarding a medical condition.
          </p>
        </div>
        
        <div className="text-muted-foreground print:hidden max-w-3xl mx-auto">
          <p className="text-left text-blue-600 dark:text-blue-400">
            Click on segments to select them. You can select up to 2 segments per slice, to indicate typical and under stress impact. Click{' '}
            <a 
              href="https://youtu.be/z_VcEjngmMI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline"
            >
              <YouTubeIcon className="w-3 h-3" />
              https://youtu.be/z_VcEjngmMI
            </a>
            {' '}to view a brief tutorial video.
          </p>
        </div>
      </div>
      
      <div className="relative">
        <TooltipProvider>
          <svg ref={svgRef} width="750" height="750" viewBox="0 0 750 750">
            {/* Light segments (second selection) - drawn first, behind all grid lines */}
            {Array.from({ length: sliceLabels.length }, (_, sliceIndex) =>
              Array.from({ length: TOTAL_RINGS }, (_, ringIndex) => {
                const currentSelections = selections[sliceIndex] || [];
                if (currentSelections.length !== 2) return null; // Only render for dual selections
                
                const segmentNumber = ringIndex + 1;
                const [first, second] = currentSelections.sort((a, b) => a - b);
                
                // Only render light segments (between first and second selection)
                if (segmentNumber <= first || segmentNumber > second) return null;
                
                const path = createSegmentPath(sliceIndex, ringIndex);
                const baseColor = sliceColors[sliceIndex];
                const fill = baseColor + '80'; // 50% opacity for light segments
                
                return (
                  <Tooltip key={`light-segment-${sliceIndex}-${ringIndex}`} delayDuration={600}>
                    <TooltipTrigger asChild>
                      <path
                        d={path}
                        fill={fill}
                        stroke={isDarkMode ? "#808080" : "white"}
                        strokeWidth="1"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleSegmentClick(sliceIndex, ringIndex)}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-medium">{sliceLabels[sliceIndex]}</div>
                        <div className="text-sm text-muted-foreground">
                          Impact {ringIndex + 1}/10 - {getSupportNeedsText(ringIndex + 1)}
                        </div>
                        {sliceDescriptions[sliceIndex] && (
                          <div className="text-sm text-muted-foreground">
                            {sliceDescriptions[sliceIndex]}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })
            )}

            {/* Dark segments and unselected segments - drawn second, still behind all grid lines */}
            {Array.from({ length: sliceLabels.length }, (_, sliceIndex) =>
              Array.from({ length: TOTAL_RINGS }, (_, ringIndex) => {
                const currentSelections = selections[sliceIndex] || [];
                const segmentNumber = ringIndex + 1;
                const baseColor = sliceColors[sliceIndex];
                
                let fill = 'rgba(0, 0, 0, 0.05)'; // default unselected
                let shouldRender = true;
                
                if (currentSelections.length === 0) {
                  fill = 'rgba(0, 0, 0, 0.05)';
                } else if (currentSelections.length === 1) {
                  const selectedSegment = currentSelections[0];
                  if (segmentNumber <= selectedSegment) {
                    fill = baseColor; // Dark segment
                  } else {
                    fill = 'rgba(0, 0, 0, 0.05)'; // Unselected
                  }
                } else if (currentSelections.length === 2) {
                  const [first, second] = currentSelections.sort((a, b) => a - b);
                  if (segmentNumber <= first) {
                    fill = baseColor; // Dark segment
                  } else if (segmentNumber <= second) {
                    // Light segment - don't render here as it's already rendered above
                    shouldRender = false;
                  } else {
                    fill = 'rgba(0, 0, 0, 0.05)'; // Unselected
                  }
                }
                
                if (!shouldRender) return null;
                
                const path = createSegmentPath(sliceIndex, ringIndex);
                
                return (
                  <Tooltip key={`segment-${sliceIndex}-${ringIndex}`} delayDuration={600}>
                    <TooltipTrigger asChild>
                      <path
                        d={path}
                        fill={fill}
                        stroke={isDarkMode ? "#808080" : "white"}
                        strokeWidth="1"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleSegmentClick(sliceIndex, ringIndex)}
                      />
                    </TooltipTrigger>
                    <TooltipContent side="top" className="max-w-xs">
                      <div className="space-y-1">
                        <div className="font-medium">{sliceLabels[sliceIndex]}</div>
                        <div className="text-sm text-muted-foreground">
                          Impact {ringIndex + 1}/10 - {getSupportNeedsText(ringIndex + 1)}
                        </div>
                        {sliceDescriptions[sliceIndex] && (
                          <div className="text-sm text-muted-foreground">
                            {sliceDescriptions[sliceIndex]}
                          </div>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })
            )}

            {/* Grid lines - drawn on top of all segments */}
            {Array.from({ length: TOTAL_RINGS + 1 }, (_, i) => {
              const radius = MIN_RADIUS + i * RING_WIDTH;
              // Highlight boundaries between groups: 4-5 (index 4) and 7-8 (index 7)
              const isGroupBoundary = i === 4 || i === 7;
              
              let strokeColor = "#e5e7eb"; // default light grey
              let strokeWidth = "1";
              
              if (isGroupBoundary) {
                if (boundaryWeight === 'hidden') {
                  strokeColor = isDarkMode ? "#111827" : "#e5e7eb"; // much darker in dark mode
                  strokeWidth = "1";
                } else if (boundaryWeight === 'bold') {
                  strokeColor = isDarkMode ? "#4b5563" : "#9ca3af"; // darker in dark mode, lighter in light mode
                  strokeWidth = isDarkMode ? "4" : "3"; // even thicker in dark mode
                } else { // normal
                  strokeColor = isDarkMode ? "#4b5563" : "#9ca3af"; // darker in dark mode, lighter in light mode
                  strokeWidth = isDarkMode ? "4" : "3"; // even thicker in dark mode
                }
              } else {
                // Regular grid lines - much darker in dark mode
                strokeColor = isDarkMode ? "#111827" : "#e5e7eb";
                strokeWidth = "1";
              }
              
              return (
                <circle
                  key={`ring-${i}`}
                  cx={CENTER_X}
                  cy={CENTER_Y}
                  r={radius}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                />
              );
            })}
            
            {/* Slice dividers - drawn on top of segments */}
            {Array.from({ length: sliceLabels.length }, (_, i) => {
              // Add a small offset to prevent perfectly vertical/horizontal lines which can render differently
              const angleOffset = 0.001; // Very small offset in radians
              const angle = (i * 2 * Math.PI) / sliceLabels.length - Math.PI / 2 + angleOffset;
              const x = CENTER_X + MAX_RADIUS * Math.cos(angle);
              const y = CENTER_Y + MAX_RADIUS * Math.sin(angle);
              
              return (
                <line
                  key={`divider-${i}`}
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={x}
                  y2={y}
                  stroke={isDarkMode ? "#111827" : "#e5e7eb"}
                  strokeWidth="1"
                />
              );
            })}

            {/* Inner circle radial dividers - 30% dark grey - drawn on top of segments */}
            {Array.from({ length: sliceLabels.length }, (_, i) => {
              // Add a small offset to prevent perfectly vertical/horizontal lines which can render differently
              const angleOffset = 0.001; // Very small offset in radians
              const angle = (i * 2 * Math.PI) / sliceLabels.length - Math.PI / 2 + angleOffset;
              const innerX = CENTER_X + MIN_RADIUS * Math.cos(angle);
              const innerY = CENTER_Y + MIN_RADIUS * Math.sin(angle);
              
              return (
                <line
                  key={`inner-divider-${i}`}
                  x1={CENTER_X}
                  y1={CENTER_Y}
                  x2={innerX}
                  y2={innerY}
                  stroke={isDarkMode ? "#4b5563" : "#B3B3B3"}
                  strokeWidth="1"
                />
              );
            })}            
            {/* Selection numbers */}
            {numberPosition !== 'hidden' && Array.from({ length: sliceLabels.length }, (_, sliceIndex) => {
              const currentSelections = selections[sliceIndex] || [];
              if (currentSelections.length === 0) return null;
              
              return currentSelections.map((selectionNumber) => {
                const ringIndex = selectionNumber - 1; // Convert back to 0-based
                const angleStep = (2 * Math.PI) / sliceLabels.length;
                
                // Position numbers based on user preference
                let angleMultiplier;
                switch (numberPosition) {
                  case 'left':
                    angleMultiplier = 0.25; // 25% towards the end angle
                    break;
                  case 'center':
                    angleMultiplier = 0.5; // Center of segment
                    break;
                  case 'right':
                  default:
                    angleMultiplier = 0.75; // 75% towards the end angle
                    break;
                }
                
                const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep * angleMultiplier;
                const radius = MIN_RADIUS + (ringIndex + 0.5) * RING_WIDTH; // Center of ring
                
                const x = CENTER_X + radius * Math.cos(angle);
                const y = CENTER_Y + radius * Math.sin(angle);
                
                // Determine the text color based on segment color
                const baseColor = sliceColors[sliceIndex];
                let textColor;
                
                if (currentSelections.length === 1) {
                  // Only one selection, so this number is in the dark color range
                  textColor = darkenColor(baseColor);
                } else if (currentSelections.length === 2) {
                  const [firstSelection, secondSelection] = currentSelections;
                  if (selectionNumber === firstSelection) {
                    // This is the first selection, in the dark color range
                    textColor = darkenColor(baseColor);
                  } else {
                    // This is the second selection, in the light color range
                    // Since the light color is baseColor + '80' (50% opacity), we darken the base color less
                    textColor = darkenColor(baseColor, 0.15);
                  }
                }
                
                return (
                  <text
                    key={`selection-number-${sliceIndex}-${selectionNumber}`}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-sm pointer-events-none"
                    style={{ 
                      fontWeight: 'bold',
                      fill: textColor
                    }}
                  >
                    {selectionNumber}
                  </text>
                );
              });
            })}

            {/* Labels as SVG text */}
            {labelStyle !== 'hidden' && sliceLabels.map((label, sliceIndex) => {
              const { x, y, angle } = getLabelPosition(sliceIndex);
              const rotation = angle * (180 / Math.PI);
              const shouldFlip = rotation > 90 && rotation < 270;
              const finalRotation = shouldFlip ? rotation + 180 : rotation;
              
              // Split long labels into multiple lines
              const words = label.split(' ');
              const maxWordsPerLine = words.length > 3 ? 2 : words.length;
              const lines = [];
              
              for (let i = 0; i < words.length; i += maxWordsPerLine) {
                lines.push(words.slice(i, i + maxWordsPerLine).join(' '));
              }
              
              return (
                <g key={`label-${sliceIndex}`}>
                  {lines.map((line, lineIndex) => (
                    <text
                      key={`label-line-${sliceIndex}-${lineIndex}`}
                      x={x}
                      y={y + (lineIndex - (lines.length - 1) / 2) * 12}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="14"
                      fill={isDarkMode ? "#9ca3af" : "#374151"}
                      style={{
                        fontFamily: 'system-ui, sans-serif',
                        fontWeight: labelStyle === 'bold' ? 'bold' : 'normal',
                        pointerEvents: 'none'
                      }}
                      transform={`rotate(${finalRotation} ${x} ${y})`}
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            })}

            {/* Center icons */}
            {showIcons && sliceIcons.map((icon, sliceIndex) => {
              if (!icon) return null;
              
              const angleStep = (2 * Math.PI) / sliceLabels.length;
              const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2; // Center of slice
              const iconRadius = MIN_RADIUS * 0.7; // Position icons inside the center circle
              
              const x = CENTER_X + iconRadius * Math.cos(angle);
              const y = CENTER_Y + iconRadius * Math.sin(angle);
              
              return (
                <text
                  key={`center-icon-${sliceIndex}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="20"
                  style={{
                    fontFamily: 'system-ui, sans-serif',
                    pointerEvents: 'none'
                  }}
                >
                  {icon}
                </text>
              );
            })}
          </svg>
        </TooltipProvider>

      </div>
      
      {/* Display Options */}
      <div className="flex flex-wrap gap-4 justify-center print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
            <Settings className="w-4 h-4" />
            Numbers
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem 
              onClick={() => setNumberPosition('left')}
              className={numberPosition === 'left' ? 'bg-accent' : ''}
            >
              Left aligned
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setNumberPosition('center')}
              className={numberPosition === 'center' ? 'bg-accent' : ''}
            >
              Center aligned
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setNumberPosition('right')}
              className={numberPosition === 'right' ? 'bg-accent' : ''}
            >
              Right aligned
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setNumberPosition('hidden')}
              className={numberPosition === 'hidden' ? 'bg-accent' : ''}
            >
              Hidden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
            <Settings className="w-4 h-4" />
            Labels
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem 
              onClick={() => setLabelStyle('normal')}
              className={labelStyle === 'normal' ? 'bg-accent' : ''}
            >
              Normal weight
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLabelStyle('bold')}
              className={labelStyle === 'bold' ? 'bg-accent' : ''}
            >
              Bold weight
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setLabelStyle('hidden')}
              className={labelStyle === 'hidden' ? 'bg-accent' : ''}
            >
              Hidden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
            <Settings className="w-4 h-4" />
            Icons
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem 
              onClick={() => setShowIcons(true)}
              className={showIcons ? 'bg-accent' : ''}
            >
              Show icons
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setShowIcons(false)}
              className={!showIcons ? 'bg-accent' : ''}
            >
              Hide icons
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
            <Settings className="w-4 h-4" />
            Theme
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem 
              onClick={() => setTheme('system')}
              className={theme === 'system' ? 'bg-accent' : ''}
            >
              Use system
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme('light')}
              className={theme === 'light' ? 'bg-accent' : ''}
            >
              Light
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setTheme('dark')}
              className={theme === 'dark' ? 'bg-accent' : ''}
            >
              Dark
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center print:hidden">
        {!isEditingLabels && (
          <>
            <Button 
              onClick={handleCopyLink}
              className="h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link className="w-4 h-4" />
              Copy link
            </Button>
            <Button 
              onClick={handlePrint}
              className="h-10 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 gap-2">
            Save diagram
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => saveDiagramAs('png')}>
              Save as PNG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => saveDiagramAs('svg')}>
              Save as SVG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => saveDiagramAs('jpeg')}>
              Save as JPEG
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => saveDiagramAs('html')}>
              Save as HTML
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button 
          onClick={handleEditLabels}
          className={`h-10 ${isEditingLabels ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}`}
        >
          {isEditingLabels ? "Save labels" : "Edit labels"}
        </Button>
        
        {isEditingLabels && (
          <>
            <Button 
              onClick={handleRevertChanges}
              variant="destructive"
              className="h-10"
              disabled={!hasChanges()}
              style={!hasChanges() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Revert changes
            </Button>
            <Button 
              onClick={handleDefaultLabels}
              variant="destructive"
              className="h-10"
              disabled={isAtDefaults()}
              style={isAtDefaults() ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
            >
              Default labels
            </Button>
          </>
        )}
      </div>

      {isEditingLabels && (
        <div className="w-full max-w-4xl">
          <h3 className="mb-4 font-semibold">Edit Labels</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Label Name & Description</TableHead>
                <TableHead>Color</TableHead>
                <TableHead>Delete</TableHead>
                <TableHead>Reorder</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {editingLabels.map((labelData, index) => (
                <DraggableLabelRow
                  key={labelData.id}
                  labelData={labelData}
                  index={index}
                  editingLabels={editingLabels}
                  setEditingLabels={setEditingLabels}
                  onDelete={handleDeleteLabel}
                  canDelete={editingLabels.length > 2}
                />
              ))}
              <TableRow>
                <TableCell>
                  <EmojiPicker
                    selectedEmoji={newLabelIcon}
                    onEmojiSelect={setNewLabelIcon}
                  />
                </TableCell>
                <TableCell>
                  <div className="space-y-2">
                    <Input
                      placeholder="Enter new label name..."
                      value={newLabelText}
                      onChange={(e) => setNewLabelText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
                    />
                    <Textarea
                      placeholder="Enter description..."
                      className="text-sm resize-none"
                      rows={3}
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="w-6 h-6 rounded border bg-blue-500" />
                </TableCell>
                <TableCell>
                  <Button
                    onClick={handleAddLabel}
                    variant="ghost"
                    size="sm"
                    disabled={!newLabelText.trim()}
                    className="text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TableCell>
                <TableCell />
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}

      {!isEditingLabels && (
        <div className="w-full max-w-3xl print-break-avoid">
          <h3 className="mb-4 font-semibold">Detailed Breakdown</h3>
          <div className="overflow-hidden">
            <Table className="table-fixed w-full">
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 select-none align-top w-1/2"
                    onClick={() => handleSort('category')}
                  >
                    <div className="flex items-center gap-1">
                      Category
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${sortColumn === 'category' && sortDirection === 'asc' ? 'text-foreground' : 'text-muted-foreground'}`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 -mt-1 ${sortColumn === 'category' && sortDirection === 'desc' ? 'text-foreground' : 'text-muted-foreground'}`} 
                        />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 select-none align-top text-center w-1/4"
                    onClick={() => handleSort('typical')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Typical impact
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${sortColumn === 'typical' && sortDirection === 'asc' ? 'text-foreground' : 'text-muted-foreground'}`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 -mt-1 ${sortColumn === 'typical' && sortDirection === 'desc' ? 'text-foreground' : 'text-muted-foreground'}`} 
                        />
                      </div>
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50 select-none align-top text-center w-1/4"
                    onClick={() => handleSort('stress')}
                  >
                    <div className="flex items-center justify-center gap-1">
                      Under stress impact
                      <div className="flex flex-col">
                        <ChevronUp 
                          className={`w-3 h-3 ${sortColumn === 'stress' && sortDirection === 'asc' ? 'text-foreground' : 'text-muted-foreground'}`} 
                        />
                        <ChevronDown 
                          className={`w-3 h-3 -mt-1 ${sortColumn === 'stress' && sortDirection === 'desc' ? 'text-foreground' : 'text-muted-foreground'}`} 
                        />
                      </div>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {getSortedTableData().map((rowData) => {
                  const { sliceIndex, label, icon, baseColor, firstSelection, secondSelection } = rowData;
                  const currentSelections = selections[sliceIndex] || [];
                  const [originalFirst, originalSecond] = currentSelections.sort((a, b) => a - b);
                  const description = sliceDescriptions[sliceIndex];
                  
                  return (
                    <TableRow key={`detail-${sliceIndex}`}>
                      <TableCell className="align-top break-words">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            {showIcons && icon && (
                              <span className="text-lg flex-shrink-0">{icon}</span>
                            )}
                            <span className="font-medium break-words">{label}</span>
                          </div>
                          {description && (
                            <div className="text-sm text-muted-foreground break-words whitespace-normal">
                              {description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="align-top text-center">
                        {firstSelection && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <div 
                                className="inline-block px-3 py-1 rounded min-w-8 text-center"
                                style={{ 
                                  backgroundColor: baseColor,
                                  color: darkenColor(baseColor)
                                }}
                              >
                                {firstSelection}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getSupportNeedsText(firstSelection)}
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="align-top text-center">
                        {(originalSecond || firstSelection) && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-center gap-2">
                              <div 
                                className="inline-block px-3 py-1 rounded min-w-8 text-center"
                                style={{ 
                                  backgroundColor: originalSecond ? baseColor + '80' : baseColor, // 50% opacity for second selection, full for first
                                  color: originalSecond ? darkenColor(baseColor, 0.15) : darkenColor(baseColor)
                                }}
                              >
                                {originalSecond || firstSelection}
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {getSupportNeedsText(originalSecond || firstSelection)}
                            </div>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CircularDiagram() {
  return (
    <DndProvider backend={HTML5Backend}>
      <CircularDiagramContent />
    </DndProvider>
  );
}