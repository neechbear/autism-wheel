import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Trash2, GripVertical, Plus, ChevronDown, ChevronUp, Settings, Smile, Printer, Link } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LZString from 'lz-string';

interface Selection {
  [sliceIndex: number]: number[];
}

const TOTAL_RINGS = 10;
const TOTAL_SLICES = 8;
const CENTER_X = 375;
const CENTER_Y = 375;
const MIN_RADIUS = 55;
const MAX_RADIUS = 265;
const RING_WIDTH = (MAX_RADIUS - MIN_RADIUS) / TOTAL_RINGS;

const INITIAL_SLICE_LABELS = [
  'Social Interaction',
  'Communication',
  'Sensory Processing',
  'Repetitive Behaviours and Special Interests',
  'Executive Functioning',
  'Emotional Regulation',
  'Cognitive and Learning Skills',
  'Motor Skills and Physical Development'
];

const INITIAL_SLICE_ICONS = [
  '💏',
  '🗨️',
  '👂',
  '♻️',
  '🏠',
  '😰',
  '📚',
  '🤸‍♀️'
];

// Common emoji categories for the picker
const EMOJI_CATEGORIES = {
  'People': ['😀', '😊', '🥰', '😎', '🤔', '😰', '😭', '🥱', '😴', '🤗', '🤓', '😇', '🙂', '😉', '😍', '🤩', '😘', '😗', '☺️', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤭', '🤫', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😔', '😪', '🤤', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '🧐'],
  'Body Parts': ['👁️', '👀', '👂', '👃', '👄', '👅', '🦷', '🧠', '🫀', '🫁', '👶', '🧒', '👦', '👧', '🧑', '👨', '👩', '🧓', '👴', '👵', '👤', '👥', '🗣️', '👣', '🦴', '🦵', '🦶', '💪', '🤳', '👈', '👉', '👆', '👇', '☝️', '✋', '🤚', '🖐️', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👍', '👎', '👊', '✊', '🤛', '🤜', '🫳', '🫴', '👐', '🙌', '👏', '🤝', '🙏'],
  'Animals': ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦅', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🪲', '🐛', '🦋', '🐌', '🐞', '🐜', '🪰', '🪱', '🦗', '🕷️', '🦂', '🐢', '🐍', '🦎', '🦖', '🦕', '🐙', '🦑', '🦐', '🦞', '🦀', '🐡', '🐠', '🐟', '🐬', '🐳', '🐋', '🦈', '🐊', '🐅', '🐆', '🦓', '🦍', '🦧', '🐘', '🦛', '🦏', '🐪', '🐫', '🦒', '🦘', '🦬', '🐃', '🐂', '🐄', '🐎', '🐖', '🐏', '🐑', '🦙', '🐐', '🦌', '🐕', '🐩', '🦮', '🐕‍🦺', '🐈', '🐈‍⬛'],
  'Food': ['🍎', '🍏', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥬', '🥒', '🌶️', '🫑', '🌽', '🥕', '🫒', '🧄', '🧅', '🥔', '🍠', '🥐', '🥖', '🍞', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🫗', '🥤', '🧋', '🧃', '🧉', '🧊'],
  'Medical & Therapy': ['🏥', '⚕️', '🩺', '💊', '💉', '🩹', '🩼', '🦽', '🦼', '🧑‍⚕️', '👨‍⚕️', '👩‍⚕️', '🧬', '🦠', '🧪', '🔬', '🌡️', '🩸', '🫁', '🧠', '🫀', '🦴', '👁️‍🗨️', '🗨️', '💬', '🗣️', '👂', '👁️', '🔍', '🔎', '📋', '📝', '📊', '📈', '📉', '🎯', '🧩', '🎲', '🃏', '🎴', '🀄'],
  'Gestures': ['👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏'],
  'Activities': ['🤸‍♀️', '🤸‍♂️', '🏃‍♀️', '🏃‍♂️', '🚶‍♀️', '🚶‍♂️', '🧘‍♀️', '🧘‍♂️', '🏋️‍♀️', '🏋️‍♂️', '🤾‍♀️', '🤾‍♂️', '🏌️‍♀️', '🏌️‍♂️', '🏄‍♀️', '🏄‍♂️', '🚣‍♀️', '🚣‍♂️', '🏊‍♀️', '🏊‍♂️', '⛹️‍♀️', '⛹️‍♂️', '🏇', '🧗‍♀️', '🧗‍♂️', '🚴‍♀️', '🚴‍♂️', '🤹‍♀️', '🤹‍♂️', '🎭', '🎨', '🎪', '🎬', '🎤', '🎧', '🎼', '🎵', '🎶', '🥁', '🎹', '🎸', '🎺', '🎷', '🎻', '🪕'],
  'Objects': ['📱', '💻', '⌚', '📷', '🎥', '📺', '🎮', '🕹️', '🎧', '🎤', '🎵', '🎶', '🎼', '🎹', '🥁', '🎷', '🎺', '🎸', '🪕', '🎻', '📚', '📖', '📝', '✏️', '🖍️', '🖊️', '🖋️', '✒️', '🖌️', '📐', '📏', '🧮', '📌', '📍', '✂️', '🗃️', '🗂️', '📂', '📁', '🗄️', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🪓', '🔩', '⚙️', '🧰', '🪜', '🪣', '🧽', '🧼', '🪥', '🪒', '🧴', '🪞', '🪟', '🛏️', '🪑', '🚪', '🪜', '🧸', '🎈', '🎁', '🎀', '🪩', '🎊', '🎉'],
  'Symbols': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚡', '💫', '⭐', '🌟', '✨', '☄️', '💥', '🔥', '🌈', '☀️', '🌞', '🌙', '🌛', '🌜', '🌚', '🌕', '🌖', '🌗', '🌘', '🌑', '🌒', '🌓', '🌔', '☁️', '⛅', '⛈️', '🌤️', '🌦️', '🌧️', '🌩️', '🌨️', '❄️', '☃️', '⛄', '🌬️', '💨', '🌪️', '🌫️', '☂️', '☔', '💧', '💦', '🌊', '✅', '❌', '⭕', '🛑', '⛔', '📵', '🚫', '💯', '💢', '♨️', '💤', '💨', '🕳️', '💣', '💬', '👁️‍🗨️', '🗨️', '🗯️', '💭', '💤'],
  'Buildings': ['🏠', '🏡', '🏘️', '🏚️', '🏗️', '🏭', '🏢', '🏬', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏫', '🏩', '💒', '🏛️', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪'],
  'Misc': ['♻️', '🔄', '🔁', '🔂', '⏩', '⏪', '⏫', '⏬', '◀️', '▶️', '🔼', '🔽', '➡️', '⬅️', '⬆️', '⬇️', '↗️', '↘️', '↙️', '↖️', '↕️', '↔️', '↪️', '↩️', '⤴️', '⤵️', '🔀', '🔃', '➕', '➖', '➗', '✖️', '♾️', '💲', '💱', '™️', '©️', '®️', '〰️', '➰', '➿', '🔚', '🔙', '🔛', '🔝', '🔜', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '💣', '🪃', '🏹', '🛡️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🪝', '🧰', '🧲', '🪜', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩼', '🩺', '🪶']
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
];

interface LabelData {
  id: string;
  label: string;
  color: string;
  icon: string;
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
        <Input
          value={labelData.label}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="border-none p-0 focus-visible:ring-0"
        />
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
  const [isEditingLabels, setIsEditingLabels] = useState(false);
  const [editingLabels, setEditingLabels] = useState<LabelData[]>([]);
  const [initialEditingLabels, setInitialEditingLabels] = useState<LabelData[]>([]); // Track initial state for revert functionality
  const [newLabelText, setNewLabelText] = useState('');
  const [newLabelIcon, setNewLabelIcon] = useState('😀');
  const [numberPosition, setNumberPosition] = useState<'left' | 'center' | 'right' | 'hidden'>('center');
  const [labelStyle, setLabelStyle] = useState<'normal' | 'bold' | 'hidden'>('normal');
  const [boundaryWeight, setBoundaryWeight] = useState<'normal' | 'bold' | 'hidden'>('bold');
  const [showIcons, setShowIcons] = useState<boolean>(true);
  const [sortColumn, setSortColumn] = useState<'category' | 'typical' | 'stress' | null>('stress');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const svgRef = useRef<SVGSVGElement>(null);

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
        const [firstSelection, secondSelection] = currentSelections;
        
        if (segmentNumber <= firstSelection) {
          // Clicked on a dark-colored segment, clear all selections
          return {
            ...prev,
            [sliceIndex]: []
          };
        } else if (segmentNumber <= secondSelection) {
          // Clicked on a light-colored segment, remove second selection
          return {
            ...prev,
            [sliceIndex]: [firstSelection]
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

  const saveDiagramAs = (format: 'png' | 'svg' | 'jpeg') => {
    if (!svgRef.current) return;

    if (format === 'svg') {
      // Create a new standalone SVG with proper attributes
      const svgClone = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svgClone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      svgClone.setAttribute('width', '750');
      svgClone.setAttribute('height', '750');
      svgClone.setAttribute('viewBox', '0 0 750 750');
      
      // Create white background rectangle
      const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      backgroundRect.setAttribute('x', '0');
      backgroundRect.setAttribute('y', '0');
      backgroundRect.setAttribute('width', '750');
      backgroundRect.setAttribute('height', '750');
      backgroundRect.setAttribute('fill', '#ffffff');
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
      link.download = 'circular-diagram.svg';
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

    // Set background color
    if (format === 'jpeg') {
      // JPEG doesn't support transparency, so use white background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, containerWidth, containerHeight);
    } else {
      // PNG supports transparency, but we'll use white for consistency
      ctx.fillStyle = '#ffffff';
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
        link.download = `circular-diagram.${format}`;
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

  // Helper function to check if current editing labels match defaults
  const isMatchingDefaults = (): boolean => {
    if (editingLabels.length !== INITIAL_SLICE_LABELS.length) {
      return false;
    }
    
    return editingLabels.every((item, index) => {
      return item.label === INITIAL_SLICE_LABELS[index] &&
             item.color === INITIAL_SLICE_COLORS[index] &&
             item.icon === INITIAL_SLICE_ICONS[index];
    });
  };

  // Helper function to check if changes have been made since entering edit mode
  const hasChanges = (): boolean => {
    if (editingLabels.length !== initialEditingLabels.length) {
      return true;
    }
    
    return editingLabels.some((item, index) => {
      const initial = initialEditingLabels[index];
      return !initial || 
             item.label !== initial.label ||
             item.color !== initial.color ||
             item.icon !== initial.icon;
    });
  };

  const handleEditLabels = () => {
    if (!isEditingLabels) {
      // Enter edit mode - create editing data from current labels
      const labelData = sliceLabels.map((label, index) => ({
        id: `label-${index}-${Date.now()}`,
        label,
        color: sliceColors[index],
        icon: sliceIcons[index] || '😀',
        originalIndex: index // Store original index
      }));
      setEditingLabels(labelData);
      setInitialEditingLabels([...labelData]); // Store initial state for revert functionality
      setIsEditingLabels(true);
    } else {
      // Save changes - need to remap selections based on new order
      const newLabels = editingLabels.map(item => item.label);
      const newColors = editingLabels.map(item => item.color);
      const newIcons = editingLabels.map(item => item.icon);
      
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
      setIsEditingLabels(false);
    }
  };

  const handleRevertChanges = () => {
    setEditingLabels([...initialEditingLabels]); // Revert to initial state
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
      originalIndex: index
    }));
    setEditingLabels(defaultLabelData);
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
      
      if (sortColumn === 'category') {
        comparison = a.label.localeCompare(b.label);
      } else if (sortColumn === 'typical') {
        const aValue = a.firstSelection || 0;
        const bValue = b.firstSelection || 0;
        comparison = aValue - bValue;
      } else if (sortColumn === 'stress') {
        const aValue = a.secondSelection || 0;
        const bValue = b.secondSelection || 0;
        comparison = aValue - bValue;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const createStateUrl = () => {
    const state = {
      selections,
      labels: sliceLabels,
      colors: sliceColors,
      icons: sliceIcons,
      numberPosition,
      labelStyle,
      boundaryWeight,
      showIcons
    };
    
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?state=${compressed}`;
  };

  const copyLinkToClipboard = async () => {
    const url = createStateUrl();
    
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy: ', err);
        // Fallback to the manual method
        fallbackCopyTextToClipboard(url);
      }
    } else {
      // Fallback for browsers without clipboard API or non-secure contexts
      fallbackCopyTextToClipboard(url);
    }
  };

  const fallbackCopyTextToClipboard = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Make the textarea out of viewport
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Fallback: Could not copy text: ', err);
      alert('Failed to copy link. Please copy manually: ' + text);
    }
    
    document.body.removeChild(textArea);
  };

  // Load state from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');
    
    if (stateParam) {
      try {
        const decompressed = LZString.decompressFromEncodedURIComponent(stateParam);
        if (decompressed) {
          const state = JSON.parse(decompressed);
          
          if (state.selections) setSelections(state.selections);
          if (state.labels) setSliceLabels(state.labels);
          if (state.colors) setSliceColors(state.colors);
          if (state.icons) setSliceIcons(state.icons);
          if (state.numberPosition) setNumberPosition(state.numberPosition);
          if (state.labelStyle) setLabelStyle(state.labelStyle);
          if (state.boundaryWeight) setBoundaryWeight(state.boundaryWeight);
          if (state.showIcons !== undefined) setShowIcons(state.showIcons);
        }
      } catch (err) {
        console.error('Failed to parse state from URL:', err);
      }
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 max-w-7xl mx-auto">
      {/* Left side - Main diagram */}
      <div className="flex-1 flex flex-col items-center">
        {/* Controls */}
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <Button 
            onClick={handleEditLabels} 
            variant={isEditingLabels ? "default" : "outline"}
            className="h-10"
          >
            {isEditingLabels ? 'Save labels' : 'Edit labels'}
          </Button>
          
          {isEditingLabels && (
            <>
              <Button 
                onClick={handleRevertChanges}
                variant="destructive"
                className={`h-10 ${!hasChanges() ? 'opacity-50' : ''}`}
                disabled={!hasChanges()}
              >
                Revert changes
              </Button>
              <Button 
                onClick={handleDefaultLabels}
                variant="destructive"
                className={`h-10 ${isMatchingDefaults() ? 'opacity-50' : ''}`}
                disabled={isMatchingDefaults()}
              >
                Default labels
              </Button>
            </>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                <Printer className="w-4 h-4 mr-2" />
                Save diagram
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => saveDiagramAs('png')}>
                Save as PNG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => saveDiagramAs('svg')}>
                Save as SVG
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => saveDiagramAs('jpeg')}>
                Save as JPEG
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button 
            onClick={copyLinkToClipboard}
            variant="outline" 
            className="h-10"
          >
            <Link className="w-4 h-4 mr-2" />
            Copy link
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10">
                <Settings className="w-4 h-4 mr-2" />
                Display
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium mb-2">Number Position</div>
                <div className="flex flex-col gap-1">
                  {(['left', 'center', 'right', 'hidden'] as const).map((position) => (
                    <button
                      key={position}
                      onClick={() => setNumberPosition(position)}
                      className={`text-left px-2 py-1 text-sm rounded hover:bg-accent ${
                        numberPosition === position ? 'bg-accent' : ''
                      }`}
                    >
                      {position === 'hidden' ? 'Hidden' : `${position.charAt(0).toUpperCase() + position.slice(1)}`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t mx-2 my-2"></div>
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium mb-2">Label Style</div>
                <div className="flex flex-col gap-1">
                  {(['normal', 'bold', 'hidden'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => setLabelStyle(style)}
                      className={`text-left px-2 py-1 text-sm rounded hover:bg-accent ${
                        labelStyle === style ? 'bg-accent' : ''
                      }`}
                    >
                      {style.charAt(0).toUpperCase() + style.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t mx-2 my-2"></div>
              <div className="px-2 py-1.5">
                <div className="text-sm font-medium mb-2">Border Weight</div>
                <div className="flex flex-col gap-1">
                  {(['normal', 'bold', 'hidden'] as const).map((weight) => (
                    <button
                      key={weight}
                      onClick={() => setBoundaryWeight(weight)}
                      className={`text-left px-2 py-1 text-sm rounded hover:bg-accent ${
                        boundaryWeight === weight ? 'bg-accent' : ''
                      }`}
                    >
                      {weight.charAt(0).toUpperCase() + weight.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="border-t mx-2 my-2"></div>
              <div className="px-2 py-1.5">
                <button
                  onClick={() => setShowIcons(!showIcons)}
                  className="flex items-center justify-between w-full px-2 py-1 text-sm rounded hover:bg-accent"
                >
                  Show Icons
                  <div className={`w-4 h-4 border rounded ${showIcons ? 'bg-primary border-primary' : 'border-muted-foreground'}`}>
                    {showIcons && <div className="w-full h-full flex items-center justify-center text-xs text-primary-foreground">✓</div>}
                  </div>
                </button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* SVG Diagram */}
        <div className="relative">
          <svg
            ref={svgRef}
            width="750"
            height="750"
            viewBox="0 0 750 750"
            className="w-full max-w-2xl h-auto"
          >
            {/* Segments */}
            {Array.from({ length: sliceLabels.length }, (_, sliceIndex) =>
              Array.from({ length: TOTAL_RINGS }, (_, ringIndex) => (
                <path
                  key={`segment-${sliceIndex}-${ringIndex}`}
                  d={createSegmentPath(sliceIndex, ringIndex)}
                  fill={getSegmentFill(sliceIndex, ringIndex)}
                  stroke={boundaryWeight === 'hidden' ? 'transparent' : 'white'}
                  strokeWidth={boundaryWeight === 'bold' ? '2' : '1'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleSegmentClick(sliceIndex, ringIndex)}
                />
              ))
            )}

            {/* Ring numbers */}
            {numberPosition !== 'hidden' && Array.from({ length: TOTAL_RINGS }, (_, ringIndex) => {
              const radius = MIN_RADIUS + (ringIndex + 0.5) * RING_WIDTH;
              let x = CENTER_X;
              let y = CENTER_Y - radius + 5; // Adjust for text baseline
              let textAnchor = 'middle';
              
              if (numberPosition === 'left') {
                x = CENTER_X - radius + 10;
                y = CENTER_Y + 5;
                textAnchor = 'start';
              } else if (numberPosition === 'right') {
                x = CENTER_X + radius - 10;
                y = CENTER_Y + 5;
                textAnchor = 'end';
              }
              
              return (
                <text
                  key={`ring-number-${ringIndex}`}
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  className="fill-gray-600 text-sm select-none pointer-events-none"
                >
                  {ringIndex + 1}
                </text>
              );
            })}

            {/* Slice labels */}
            {labelStyle !== 'hidden' && sliceLabels.map((label, sliceIndex) => {
              const { x, y, angle } = getLabelPosition(sliceIndex);
              const rotation = (angle * 180) / Math.PI;
              const shouldFlip = rotation > 90 && rotation < 270;
              
              return (
                <g key={`label-${sliceIndex}`}>
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    className={`fill-gray-700 text-sm select-none pointer-events-none ${
                      labelStyle === 'bold' ? 'font-bold' : ''
                    }`}
                    transform={`rotate(${shouldFlip ? rotation + 180 : rotation} ${x} ${y})`}
                  >
                    {label}
                  </text>
                </g>
              );
            })}

            {/* Center icons */}
            {showIcons && sliceIcons.map((icon, sliceIndex) => {
              const angleStep = (2 * Math.PI) / sliceLabels.length;
              const angle = sliceIndex * angleStep - Math.PI / 2 + angleStep / 2;
              const iconRadius = 35;
              const x = CENTER_X + iconRadius * Math.cos(angle);
              const y = CENTER_Y + iconRadius * Math.sin(angle) + 5; // Adjust for text baseline
              
              return (
                <text
                  key={`icon-${sliceIndex}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  className="text-lg select-none pointer-events-none"
                >
                  {icon}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Edit Labels Interface */}
        {isEditingLabels && (
          <div className="w-full max-w-4xl mt-6 space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Edit Labels</h3>
              
              <DndProvider backend={HTML5Backend}>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Icon</TableHead>
                      <TableHead>Label</TableHead>
                      <TableHead className="w-20">Color</TableHead>
                      <TableHead className="w-20">Delete</TableHead>
                      <TableHead className="w-16">Order</TableHead>
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
                  </TableBody>
                </Table>
              </DndProvider>

              <div className="flex gap-2 mt-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">New Label</label>
                  <Input
                    value={newLabelText}
                    onChange={(e) => setNewLabelText(e.target.value)}
                    placeholder="Enter label name"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddLabel();
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <EmojiPicker
                    selectedEmoji={newLabelIcon}
                    onEmojiSelect={setNewLabelIcon}
                  />
                </div>
                <Button onClick={handleAddLabel} disabled={!newLabelText.trim()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right side - Summary table */}
      <div className="lg:w-80">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Impact Summary</h3>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead 
                  className="cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => handleSort('category')}
                >
                  <div className="flex items-center gap-1">
                    Category
                    {sortColumn === 'category' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-16 text-center cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => handleSort('typical')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Typical
                    {sortColumn === 'typical' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
                <TableHead 
                  className="w-16 text-center cursor-pointer select-none hover:bg-muted/50"
                  onClick={() => handleSort('stress')}
                >
                  <div className="flex items-center justify-center gap-1">
                    Stress
                    {sortColumn === 'stress' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {getSortedTableData().map(({ sliceIndex, label, icon, baseColor, firstSelection, secondSelection }) => {
                // Calculate original second selection for display
                const currentSelections = selections[sliceIndex] || [];
                const [originalFirst, originalSecond] = currentSelections.sort((a, b) => a - b);
                
                return (
                  <TableRow key={`summary-${sliceIndex}`}>
                    <TableCell>
                      {showIcons && (
                        <span className="text-lg">{icon}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full border border-gray-300"
                          style={{ backgroundColor: baseColor }}
                        />
                        <span className="text-sm">{label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {firstSelection && (
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center text-xs text-white font-medium mx-auto"
                          style={{ 
                            backgroundColor: darkenColor(baseColor, 0.15) 
                          }}
                        >
                          {firstSelection}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {originalSecond && originalSecond !== originalFirst && (
                        <div 
                          className="w-6 h-6 rounded flex items-center justify-center text-xs font-medium mx-auto"
                          style={{ 
                            backgroundColor: baseColor + '80',
                            color: originalSecond ? darkenColor(baseColor, 0.15) : darkenColor(baseColor)
                          }}
                        >
                          {originalSecond || firstSelection}
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