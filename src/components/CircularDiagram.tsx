import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Trash2, GripVertical, Plus, ChevronDown, ChevronUp, Settings, Smile, Printer, Link, Download } from 'lucide-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LZString from 'lz-string';
import { toast } from 'sonner';

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
    setIsEditingLabels(false);
    setEditingLabels([]);
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

async function getInlinedStyles(doc: Document, base: URL): Promise<string[]> {
    const styles: string[] = [];
    const linkTags = Array.from(doc.querySelectorAll('link[rel="stylesheet"]'));
    for (const link of linkTags) {
        const href = link.getAttribute('href');
        if (href) {
            const cssUrl = new URL(href, base).href;
            const cssText = await (await fetch(cssUrl)).text();
            styles.push(`<style>${cssText}</style>`);
        }
    }
    return styles;
}

async function getInlinedScripts(doc: Document, base: URL): Promise<string[]> {
    const scripts: string[] = [];
    const scriptTags = Array.from(doc.querySelectorAll('script[src]'));
    for (const script of scriptTags) {
        const src = script.getAttribute('src');
        if (src) {
            const jsUrl = new URL(src, base).href;
            let jsText = await (await fetch(jsUrl)).text();
            jsText = jsText.replace(/<\/script>/g, '<\\/script>');
            const typeAttr = script.getAttribute('type') ? ` type="${script.getAttribute('type')}"` : '';
            const crossOriginAttr = script.hasAttribute('crossorigin') ? ' crossorigin' : '';
            scripts.push(`<script${typeAttr}${crossOriginAttr}>${jsText}</script>`);
        }
    }
    return scripts;
}

const handleDownload = async () => {
    try {
        const encodedState = encodeState();
        const docUrl = window.location.href;
        const base = new URL(docUrl);

        const htmlText = await (await fetch(docUrl)).text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const [inlinedStyles, inlinedScripts] = await Promise.all([
            getInlinedStyles(doc, base),
            getInlinedScripts(doc, base),
        ]);

        let headHtml = '';
        for (const child of Array.from(doc.head.children)) {
            const isStylesheet = child.tagName === 'LINK' && child.getAttribute('rel') === 'stylesheet';
            const isExternalScript = child.tagName === 'SCRIPT' && child.getAttribute('src');
            if (!isStylesheet && !isExternalScript) {
                headHtml += child.outerHTML + '\n';
            }
        }

        const finalHtml = `<!DOCTYPE html>
<html lang="${doc.documentElement.lang || 'en'}">
<head>
    ${headHtml}
    ${inlinedStyles.join('\n')}
    ${inlinedScripts.join('\n')}
    <script>window.__PRELOADED_STATE__ = "${encodedState}";</script>
</head>
<body>
    ${doc.body.innerHTML}
</body>
</html>`;

        const blob = new Blob([finalHtml], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'autismwheel.html';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

    } catch (error) {
        console.error("Failed to download diagram:", error);
        toast.error("Could not download diagram. Please check the console for errors.");
    }
};

  // Function to encode current state to URL parameters (with compression)
  const encodeState = () => {
    const state = {
      selections,
      sliceLabels,
      sliceColors,
      sliceIcons,
      numberPosition,
      labelStyle,
      boundaryWeight,
      showIcons,
      sortColumn,
      sortDirection
    };
    
    // Convert to JSON, compress, and encode for URL
    const jsonString = JSON.stringify(state);
    const compressedString = LZString.compressToEncodedURIComponent(jsonString);
    return compressedString;
  };

  // Function to decode state from URL parameters (with decompression and fallback)
  const decodeState = (encodedState: string) => {
    try {
      // First try the new compressed format
      const decompressedString = LZString.decompressFromEncodedURIComponent(encodedState);
      if (decompressedString) {
        const state = JSON.parse(decompressedString);
        return state;
      }
      
      // Fallback to old base64 format for backward compatibility
      const jsonString = decodeURIComponent(escape(atob(encodedState)));
      const state = JSON.parse(jsonString);
      return state;
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
    
    // Check if clipboard API is available and we're in a secure context
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(urlString);
        alert('Link copied to clipboard!');
        return;
      } catch (error) {
        console.warn('Modern clipboard API failed, trying fallback:', error);
        // Fall through to fallback methods
      }
    }
    
    // Fallback method using deprecated execCommand
    try {
      const tempInput = document.createElement('input');
      tempInput.value = urlString;
      tempInput.style.position = 'fixed';
      tempInput.style.left = '-999999px';
      tempInput.style.top = '-999999px';
      tempInput.style.opacity = '0';
      tempInput.style.pointerEvents = 'none';
      tempInput.setAttribute('readonly', '');
      
      document.body.appendChild(tempInput);
      
      // For mobile devices - improved mobile support
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        tempInput.contentEditable = 'true';
        tempInput.readOnly = false;
        const range = document.createRange();
        range.selectNodeContents(tempInput);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        tempInput.setSelectionRange(0, 999999);
      } else {
        tempInput.select();
        tempInput.setSelectionRange(0, tempInput.value.length);
      }
      
      const successful = document.execCommand('copy');
      document.body.removeChild(tempInput);
      
      if (successful) {
        alert('Link copied to clipboard!');
        return;
      } else {
        throw new Error('execCommand copy failed');
      }
    } catch (fallbackError) {
      console.warn('Fallback copy method failed:', fallbackError);
      
      // Final fallback: Show URL in a way user can easily copy
      const fallbackMessage = `Copy this link manually:\n\n${urlString}`;
      
      // Try using a prompt first (allows easy selection on many browsers)
      try {
        const userInput = prompt('Copy this link:', urlString);
        // If user didn't cancel, assume they copied it
        if (userInput !== null) {
          alert('Please use the link that was displayed in the previous dialog.');
        }
      } catch (promptError) {
        console.warn('Prompt failed, using alert:', promptError);
        // Last resort: just show the URL in an alert
        alert(fallbackMessage);
      }
    }
  };

  // Load state from URL on component mount
  useEffect(() => {
    // Function to apply decoded state
    const applyState = (decodedState: any) => {
      if (decodedState) {
        if (decodedState.selections) setSelections(decodedState.selections);
        if (decodedState.sliceLabels) setSliceLabels(decodedState.sliceLabels);
        if (decodedState.sliceColors) setSliceColors(decodedState.sliceColors);
        if (decodedState.sliceIcons) setSliceIcons(decodedState.sliceIcons);
        if (decodedState.numberPosition) setNumberPosition(decodedState.numberPosition);
        if (decodedState.labelStyle) setLabelStyle(decodedState.labelStyle);
        if (decodedState.boundaryWeight) setBoundaryWeight(decodedState.boundaryWeight);
        if (decodedState.showIcons !== undefined) setShowIcons(decodedState.showIcons);
        if (decodedState.sortColumn) setSortColumn(decodedState.sortColumn);
        if (decodedState.sortDirection) setSortDirection(decodedState.sortDirection);
      }
    };

    // Prioritize preloaded state from downloaded file
    const preloadedState = (window as any).__PRELOADED_STATE__;
    if (preloadedState) {
      const decodedState = decodeState(preloadedState);
      applyState(decodedState);
    } else {
      // Fallback to URL parameters for shared links
      const urlParams = new URLSearchParams(window.location.search);
      const encodedState = urlParams.get('state');
      if (encodedState) {
        const decodedState = decodeState(encodedState);
        applyState(decodedState);
      }
    }
  }, []);

  // Helper function to normalize strings for matching
  const normalizeString = (str: string): string => {
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
  };

  // Helper function to create anchor links for ASD levels with robust matching
  const getAnchorLink = (number: number, label: string) => {
    let level = "";
    if (number >= 1 && number <= 4) level = "level1";
    else if (number >= 5 && number <= 7) level = "level2";
    else if (number >= 8 && number <= 10) level = "level3";
    else return level;

    // Available anchor categories for each level
    const availableAnchors = [
      'social-interaction',
      'communication', 
      'sensory-processing',
      'repetitive-behaviours',
      'executive-functioning',
      'emotional-regulation',
      'cognitive-learning',
      'motor-skills'
    ];

    // Original category mapping for reference
    const originalCategories = [
      'Social Interaction',
      'Communication',
      'Sensory Processing', 
      'Repetitive Behaviours and Special Interests',
      'Executive Functioning',
      'Emotional Regulation',
      'Cognitive and Learning Skills',
      'Motor Skills and Physical Development'
    ];

    // Normalize the input label
    const normalizedLabel = normalizeString(label);
    
    // Step 1: Try exact match with normalized original categories
    for (let i = 0; i < originalCategories.length; i++) {
      const normalizedOriginal = normalizeString(originalCategories[i]);
      if (normalizedLabel === normalizedOriginal) {
        return `${level}-${availableAnchors[i]}`;
      }
    }

    // Step 2: Try partial match - check if whole normalized label exists in any normalized original category
    for (let i = 0; i < originalCategories.length; i++) {
      const normalizedOriginal = normalizeString(originalCategories[i]);
      if (normalizedOriginal.includes(normalizedLabel)) {
        return `${level}-${availableAnchors[i]}`;
      }
    }

    // Step 3: Try reverse partial match - check if any normalized original category exists in the normalized label
    for (let i = 0; i < originalCategories.length; i++) {
      const normalizedOriginal = normalizeString(originalCategories[i]);
      if (normalizedLabel.includes(normalizedOriginal)) {
        return `${level}-${availableAnchors[i]}`;
      }
    }

    // Step 4: Try keyword-based matching for common terms
    const keywordMap: { [key: string]: string } = {
      'social': 'social-interaction',
      'interaction': 'social-interaction',
      'communication': 'communication',
      'communicate': 'communication',
      'speech': 'communication',
      'language': 'communication',
      'sensory': 'sensory-processing',
      'processing': 'sensory-processing',
      'sound': 'sensory-processing',
      'noise': 'sensory-processing',
      'touch': 'sensory-processing',
      'texture': 'sensory-processing',
      'light': 'sensory-processing',
      'repetitive': 'repetitive-behaviours',
      'behaviour': 'repetitive-behaviours',
      'behavior': 'repetitive-behaviours',
      'routine': 'repetitive-behaviours',
      'interest': 'repetitive-behaviours',
      'obsession': 'repetitive-behaviours',
      'executive': 'executive-functioning',
      'functioning': 'executive-functioning',
      'planning': 'executive-functioning',
      'organization': 'executive-functioning',
      'organisation': 'executive-functioning',
      'memory': 'executive-functioning',
      'emotional': 'emotional-regulation',
      'emotion': 'emotional-regulation',
      'regulation': 'emotional-regulation',
      'feeling': 'emotional-regulation',
      'mood': 'emotional-regulation',
      'meltdown': 'emotional-regulation',
      'shutdown': 'emotional-regulation',
      'cognitive': 'cognitive-learning',
      'learning': 'cognitive-learning',
      'academic': 'cognitive-learning',
      'education': 'cognitive-learning',
      'school': 'cognitive-learning',
      'study': 'cognitive-learning',
      'motor': 'motor-skills',
      'movement': 'motor-skills',
      'coordination': 'motor-skills',
      'physical': 'motor-skills',
      'balance': 'motor-skills',
      'dexterity': 'motor-skills'
    };

    // Check for keyword matches
    for (const [keyword, anchor] of Object.entries(keywordMap)) {
      if (normalizedLabel.includes(keyword)) {
        return `${level}-${anchor}`;
      }
    }
    
    // Fall back to general level if no category match found
    return level;
  };

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Autism Wheel</h1>
        
        <div className="mb-6 max-w-3xl mx-auto space-y-4">
          <p className="text-left">
            Hello! Thank you for using the Autism Wheel. I developed this tool as a personal project to help individuals visualize and better understand their own unique autistic profiles.
          </p>
          <p className="text-left">
            Please remember, I am not a medical professional, and this tool is not intended for diagnosis, treatment, or as a replacement for professional medical advice. It is simply a resource for personal reflection. Always seek the guidance of a doctor or other qualified health professional with any questions you may have regarding a medical condition.
          </p>
          <p className="text-blue-600 print:hidden">
            Click on segments to select them. You can select up to 2 segments per slice, to indicate typical and under stress impact. Click https://www.youtube.com/watch?v=NUcN7ZhDm98 to view a brief tutorial video.
          </p>
        </div>
      </div>
      
      <div className="relative">
        <svg ref={svgRef} width="750" height="750" viewBox="0 0 750 750">
          {/* Grid lines */}
          {Array.from({ length: TOTAL_RINGS + 1 }, (_, i) => {
            const radius = MIN_RADIUS + i * RING_WIDTH;
            // Highlight boundaries between groups: 4-5 (index 4) and 7-8 (index 7)
            const isGroupBoundary = i === 4 || i === 7;
            
            let strokeColor = "#e5e7eb"; // default light grey
            let strokeWidth = "1";
            
            if (isGroupBoundary) {
              if (boundaryWeight === 'hidden') {
                strokeColor = "#e5e7eb"; // same as normal lines
                strokeWidth = "1";
              } else if (boundaryWeight === 'bold') {
                strokeColor = "#374151"; // darker grey
                strokeWidth = "2";
              } else { // normal
                strokeColor = "#374151"; // darker grey
                strokeWidth = "1";
              }
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
          
          {/* Slice dividers */}
          {Array.from({ length: sliceLabels.length }, (_, i) => {
            const angle = (i * 2 * Math.PI) / sliceLabels.length - Math.PI / 2;
            const x = CENTER_X + MAX_RADIUS * Math.cos(angle);
            const y = CENTER_Y + MAX_RADIUS * Math.sin(angle);
            return (
              <line
                key={`divider-${i}`}
                x1={CENTER_X}
                y1={CENTER_Y}
                x2={x}
                y2={y}
                stroke="#e5e7eb"
                strokeWidth="1"
              />
            );
          })}
          
          {/* Segments */}
          {Array.from({ length: sliceLabels.length }, (_, sliceIndex) =>
            Array.from({ length: TOTAL_RINGS }, (_, ringIndex) => {
              const path = createSegmentPath(sliceIndex, ringIndex);
              const fill = getSegmentFill(sliceIndex, ringIndex);
              
              return (
                <path
                  key={`segment-${sliceIndex}-${ringIndex}`}
                  d={path}
                  fill={fill}
                  stroke="white"
                  strokeWidth="1"
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => handleSegmentClick(sliceIndex, ringIndex)}
                />
              );
            })
          )}
          
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
                    fill="#374151"
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

      </div>
      
      {/* Display Options */}
      <div className="flex flex-wrap gap-4 justify-center print:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 gap-2">
            <Settings className="w-4 h-4" />
            Boundaries
            <ChevronDown className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem 
              onClick={() => setBoundaryWeight('normal')}
              className={boundaryWeight === 'normal' ? 'bg-accent' : ''}
            >
              Normal weight
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setBoundaryWeight('bold')}
              className={boundaryWeight === 'bold' ? 'bg-accent' : ''}
            >
              Bold weight
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => setBoundaryWeight('hidden')}
              className={boundaryWeight === 'hidden' ? 'bg-accent' : ''}
            >
              Hidden
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center print:hidden">
        {!isEditingLabels && (
          <>
            <Button 
              onClick={handleCopyLink}
              variant="outline"
              className="h-10 gap-2"
            >
              <Link className="w-4 h-4" />
              Copy link
            </Button>
            <Button 
              onClick={handlePrint}
              variant="outline"
              className="h-10 gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              className="h-10 gap-2"
            >
              <Download className="w-4 h-4" />
              Download
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
              Save as PNG (default)
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
          onClick={handleEditLabels}
          variant={isEditingLabels ? "default" : "outline"}
          className={`h-10 ${isEditingLabels ? "bg-blue-600 hover:bg-blue-700" : "border-blue-600 text-blue-600 hover:bg-blue-50"}`}
        >
          {isEditingLabels ? "Save labels" : "Edit labels"}
        </Button>
        
        {isEditingLabels && (
          <>
            <Button 
              onClick={handleRevertChanges}
              variant="destructive"
              className="h-10"
            >
              Revert changes
            </Button>
            <Button 
              onClick={handleDefaultLabels}
              variant="destructive"
              className="h-10"
            >
              Default labels
            </Button>
          </>
        )}
      </div>

      {isEditingLabels && (
        <div className="w-full max-w-4xl">
          <h3 className="mb-4">Edit Labels</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Icon</TableHead>
                <TableHead>Label Name</TableHead>
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
                  <Input
                    placeholder="Enter new label name..."
                    value={newLabelText}
                    onChange={(e) => setNewLabelText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLabel()}
                  />
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
        <div className="w-full max-w-4xl print-break-avoid">
          <h3 className="mb-4 font-semibold">Detailed breakdown</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer hover:bg-muted/50 select-none"
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
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('typical')}
                >
                  <div className="flex items-center gap-1">
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
                  className="cursor-pointer hover:bg-muted/50 select-none"
                  onClick={() => handleSort('stress')}
                >
                  <div className="flex items-center gap-1">
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
                
                // Helper function to get ASD level text
                const getASDLevel = (number: number) => {
                  if (number >= 1 && number <= 4) return "ASD level 1";
                  if (number >= 5 && number <= 7) return "ASD level 2";
                  if (number >= 8 && number <= 10) return "ASD level 3";
                  return "";
                };
                
                return (
                  <TableRow key={`detail-${sliceIndex}`}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {showIcons && icon && (
                          <span className="text-lg">{icon}</span>
                        )}
                        <span>{label}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {firstSelection && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="inline-block px-3 py-1 rounded min-w-8 text-center"
                            style={{ 
                              backgroundColor: baseColor,
                              color: darkenColor(baseColor)
                            }}
                          >
                            {firstSelection}
                          </div>
                          <a 
                            href={`#${getAnchorLink(firstSelection, label)}`}
                            className="text-muted-foreground hover:text-foreground transition-colors no-underline"
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(getAnchorLink(firstSelection, label));
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                          >
                            {getASDLevel(firstSelection)}
                          </a>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {(originalSecond || firstSelection) && (
                        <div className="flex items-center gap-2">
                          <div 
                            className="inline-block px-3 py-1 rounded min-w-8 text-center"
                            style={{ 
                              backgroundColor: originalSecond ? baseColor + '80' : baseColor, // 50% opacity for second selection, full for first
                              color: originalSecond ? darkenColor(baseColor, 0.15) : darkenColor(baseColor)
                            }}
                          >
                            {originalSecond || firstSelection}
                          </div>
                          <a 
                            href={`#${getAnchorLink(originalSecond || firstSelection, label)}`}
                            className="text-muted-foreground hover:text-foreground transition-colors no-underline"
                            onClick={(e) => {
                              e.preventDefault();
                              const element = document.getElementById(getAnchorLink(originalSecond || firstSelection, label));
                              if (element) {
                                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }}
                          >
                            {getASDLevel(originalSecond || firstSelection)}
                          </a>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {!isEditingLabels && (
        <div className="w-full max-w-4xl print-page-break">
          <h3 className="mb-4 font-semibold">Explanation</h3>
          <div className="space-y-6 prose prose-slate max-w-none">
            <p>
              While there is no single, universally mandated mapping of ASD levels to a numerical scale, we can establish a helpful framework. This framework is based on the descriptions of support needs found in the world's leading diagnostic manuals: the DSM-5 (Diagnostic and Statistical Manual of Mental Disorders), widely used in the US, and the ICD-11 (International Classification of Diseases), used throughout Europe and many other countries.
            </p>
            <p>
              It's important to note that a self-assessment on an autism wheel is for personal understanding and not a substitute for a clinical diagnosis.
            </p>

            <div>
              <h1 id="level1" className="mb-4 underline">Level 1: Requiring Support</h1>
              
              <p className="mb-4">
                An individual at this level requires some support. Their challenges may not be immediately obvious in all situations, but they can affect social, occupational, and other important areas of functioning.
              </p>

              <div className="mb-4">
                <h2 id="level1-social-interaction" className="mb-1">{showIcons ? '💏 ' : ''}Social Interaction</h2>
                <div className="pl-6">
                  May have difficulty initiating or maintaining social interactions and may struggle with the natural back-and-forth of conversation. Attempts to make friends can be "odd" or unsuccessful, leading to feelings of isolation.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level1-communication" className="mb-1">{showIcons ? '🗨️ ' : ''}Communication</h2>
                <div className="pl-6">
                  Can typically speak in full sentences but may have trouble with non-literal language (sarcasm, idioms) or reading non-verbal cues like body language and facial expressions.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level1-sensory-processing" className="mb-1">{showIcons ? '👂 ' : ''}Sensory Processing</h2>
                <div className="pl-6">
                  May be sensitive to certain textures, sounds, or lighting, but can often manage with minor accommodations or by developing coping strategies.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level1-repetitive-behaviours" className="mb-1">{showIcons ? '♻️ ' : ''}Repetitive Behaviours and Special Interests</h2>
                <div className="pl-6">
                  May have special interests that are more intense than typical, or might engage in repetitive behaviours that provide comfort or help manage anxiety.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level1-executive-functioning" className="mb-1">{showIcons ? '🏠 ' : ''}Executive Functioning</h2>
                <div className="pl-6">
                  May have difficulty with planning, organization, or switching between tasks. Can usually handle routine tasks but may struggle with unexpected changes.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level1-emotional-regulation" className="mb-1">{showIcons ? '😰 ' : ''}Emotional Regulation</h2>
                <div className="pl-6">
                  May experience anxiety or emotional overwhelm in certain situations, but can usually manage with the right strategies and support.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level1-cognitive-learning" className="mb-1">{showIcons ? '📚 ' : ''}Cognitive and Learning Skills</h2>
                <div className="pl-6">
                  Often has average or above-average intelligence but may have specific learning differences or need alternative approaches to traditional teaching methods.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level1-motor-skills" className="mb-1">{showIcons ? '🤸‍♀️ ' : ''}Motor Skills and Physical Development</h2>
                <div className="pl-6">
                  May have subtle differences in coordination or motor planning, but these typically don't significantly impact daily activities.
                </div>
              </div>
            </div>

            <div>
              <h1 id="level2" className="mb-4 underline">Level 2: Requiring Substantial Support</h1>
              
              <p className="mb-4">
                An individual at this level requires substantial support. Their challenges are more noticeable and significantly impact their daily life and functioning.
              </p>

              <div className="mb-4">
                <h2 id="level2-social-interaction" className="mb-1">{showIcons ? '💏 ' : ''}Social Interaction</h2>
                <div className="pl-6">
                  Has marked difficulty with social communication and interaction. May struggle to maintain conversations, understand social cues, or form relationships even with support.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level2-communication" className="mb-1">{showIcons ? '🗨️ ' : ''}Communication</h2>
                <div className="pl-6">
                  May have limited verbal communication or use repetitive phrases. Often has difficulty expressing needs and may rely on alternative communication methods.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level2-sensory-processing" className="mb-1">{showIcons ? '👂 ' : ''}Sensory Processing</h2>
                <div className="pl-6">
                  Experiences significant sensory sensitivities that noticeably impact daily functioning and may require substantial environmental modifications.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level2-repetitive-behaviours" className="mb-1">{showIcons ? '♻️ ' : ''}Repetitive Behaviours and Special Interests</h2>
                <div className="pl-6">
                  Engages in obvious repetitive behaviours that interfere with daily activities. May have intense special interests that significantly impact functioning.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level2-executive-functioning" className="mb-1">{showIcons ? '🏠 ' : ''}Executive Functioning</h2>
                <div className="pl-6">
                  Has significant difficulty with planning, organization, and adapting to change. Requires substantial support to manage daily tasks and transitions.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level2-emotional-regulation" className="mb-1">{showIcons ? '😰 ' : ''}Emotional Regulation</h2>
                <div className="pl-6">
                  Experiences significant emotional dysregulation that impacts daily functioning. May have frequent meltdowns or shutdowns that require substantial support to manage.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level2-cognitive-learning" className="mb-1">{showIcons ? '📚 ' : ''}Cognitive and Learning Skills</h2>
                <div className="pl-6">
                  May have significant learning differences that require specialized educational approaches and substantial support to achieve academic or vocational goals.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level2-motor-skills" className="mb-1">{showIcons ? '🤸‍♀️ ' : ''}Motor Skills and Physical Development</h2>
                <div className="pl-6">
                  Has noticeable difficulties with motor coordination that impact daily activities and may require occupational therapy or other interventions.
                </div>
              </div>
            </div>

            <div>
              <h1 id="level3" className="mb-4 underline">Level 3: Requiring Very Substantial Support</h1>
              
              <p className="mb-4">
                An individual at this level requires very substantial support. Their challenges are severe and pervasive, significantly limiting their independence and requiring intensive, ongoing support.
              </p>

              <div className="mb-4">
                <h2 id="level3-social-interaction" className="mb-1">{showIcons ? '💏 ' : ''}Social Interaction</h2>
                <div className="pl-6">
                  Has severe deficits in social communication and interaction. May show very little interest in social interactions or may not initiate or respond to social overtures.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level3-communication" className="mb-1">{showIcons ? '🗨️ ' : ''}Communication</h2>
                <div className="pl-6">
                  Has severe limitations in verbal and non-verbal communication. May be non-speaking or have very limited speech, requiring significant support for all communication needs.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level3-sensory-processing" className="mb-1">{showIcons ? '👂 ' : ''}Sensory Processing</h2>
                <div className="pl-6">
                  Experiences severe sensory sensitivities or seeking behaviours that significantly limit functioning and participation in daily activities.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level3-repetitive-behaviours" className="mb-1">{showIcons ? '♻️ ' : ''}Repetitive Behaviours and Special Interests</h2>
                <div className="pl-6">
                  Shows severe, inflexible behaviours and special interests that markedly interfere with functioning in all settings. May be extremely distressed by small changes.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level3-executive-functioning" className="mb-1">{showIcons ? '🏠 ' : ''}Executive Functioning</h2>
                <div className="pl-6">
                  Has severe deficits in planning, organization, and flexibility that require very substantial support for all daily living activities.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level3-emotional-regulation" className="mb-1">{showIcons ? '😰 ' : ''}Emotional Regulation</h2>
                <div className="pl-6">
                  Experiences severe emotional dysregulation that significantly impacts all areas of functioning and requires intensive, ongoing support to manage.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level3-cognitive-learning" className="mb-1">{showIcons ? '📚 ' : ''}Cognitive and Learning Skills</h2>
                <div className="pl-6">
                  May have significant intellectual disabilities or learning differences that require intensive, specialized support across all learning domains.
                </div>
              </div>

              <div className="mb-4">
                <h2 id="level3-motor-skills" className="mb-1">{showIcons ? '🤸‍♀️ ' : ''}Motor Skills and Physical Development</h2>
                <div className="pl-6">
                  Has severe difficulties with motor skills that significantly impact independence and require intensive therapeutic intervention and adaptive equipment.
                </div>
              </div>
            </div>
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