import React from 'react';
import { useAppDispatch, useAppState } from '../state/AppContext';
import { Button } from './ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/DropdownMenu';
import { ChevronDown, HelpCircle, Link, Printer } from 'lucide-react';
import styles from './ActionToolbar.module.css';
import LZString from 'lz-string';

const ActionToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const state = useAppState();

  const handleEditCategories = () => {
    dispatch({ type: 'SET_VIEW', payload: 'edit' });
  };

  const handleShowHelp = () => {
    dispatch({ type: 'SET_VIEW', payload: 'help' });
  };

  const handleCopyLink = async () => {
    const stateToEncode = {
        version: state.version,
        categories: state.categories,
        profile: state.profile,
        settings: state.settings,
    };
    const jsonString = JSON.stringify(stateToEncode);
    const compressedString = LZString.compressToBase64(jsonString);
    const url = `${window.location.origin}${window.location.pathname}?state=${compressedString}`;

    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy link: ', err);
      alert('Failed to copy link. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const saveDiagramAs = (format: 'png' | 'svg') => {
    // This functionality will be re-implemented when the RadialDiagram is built.
    // For now, it's a placeholder.
    alert(`Saving as ${format.toUpperCase()} is not implemented yet.`);
    console.log("Attempted to save as", format);
  };

  const saveAsHtml = (locked: boolean) => {
    // This functionality will be re-implemented later.
    alert(`Saving as ${locked ? 'Locked ' : ''}HTML is not implemented yet.`);
  }

  return (
    <div className={styles.toolbar}>
      <Button onClick={handleCopyLink}>
        <Link size={16} />
        Copy Link
      </Button>
      <Button onClick={handlePrint}>
        <Printer size={16} />
        Print
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Save Diagram <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => saveDiagramAs('png')}>Save as PNG</DropdownMenuItem>
          <DropdownMenuItem onClick={() => saveDiagramAs('svg')}>Save as SVG</DropdownMenuItem>
          <DropdownMenuItem onClick={() => saveAsHtml(false)}>Save as HTML</DropdownMenuItem>
          <DropdownMenuItem onClick={() => saveAsHtml(true)}>Save as Locked HTML</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button onClick={handleEditCategories}>
        Edit Categories
      </Button>
      <Button onClick={handleShowHelp} variant="secondary">
        <HelpCircle size={16} />
        Help
      </Button>
    </div>
  );
};

export default ActionToolbar;