import React from 'react';
import { useAppDispatch, useAppState } from '../state/AppContext';
import { Button } from './ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/DropdownMenu';
import { ChevronDown, Settings } from 'lucide-react';
import styles from './ViewOptions.module.css';
import { AppSettings } from '../types';

const ViewOptions: React.FC = () => {
  const dispatch = useAppDispatch();
  const { settings } = useAppState();

  const handleSettingChange = (change: Partial<AppSettings>) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: change });
  };

  return (
    <div className={styles.optionsContainer}>
      {/* Numbers Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <Settings size={16} /> Numbers <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* This functionality is more complex than a simple boolean, will be implemented with the diagram */}
          <DropdownMenuItem>Show All</DropdownMenuItem>
          <DropdownMenuItem>Hide Segments</DropdownMenuItem>
          <DropdownMenuItem>Hide All</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Labels Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <Settings size={16} /> Labels <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleSettingChange({ showLabels: true })}>
            Show Labels
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSettingChange({ showLabels: false })}>
            Hide Labels
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Icons Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <Settings size={16} /> Icons <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleSettingChange({ showIcons: true })}>
            Show Icons
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSettingChange({ showIcons: false })}>
            Hide Icons
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary">
            <Settings size={16} /> Theme <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => handleSettingChange({ theme: 'system' })}>
            System
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSettingChange({ theme: 'light' })}>
            Light
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSettingChange({ theme: 'dark' })}>
            Dark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ViewOptions;