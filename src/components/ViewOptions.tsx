// View options component following Single Responsibility Principle
// Handles display settings like numbers, labels, icons, and theme

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Settings, ChevronDown } from 'lucide-react';
import { useAppContext, appActions } from '../state/AppContext';
import styles from './ViewOptions.module.css';

function ViewOptions(): JSX.Element {
  const { state, dispatch } = useAppContext();
  const { settings } = state;

  return (
    <div className={styles.container}>
      {/* Numbers Options */}
      <DropdownMenu>
        <DropdownMenuTrigger className={styles.optionButton}>
          <Settings className={styles.buttonIcon} />
          Numbers
          <ChevronDown className={styles.chevronIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setNumberPosition('left'))}
            className={settings.numberPosition === 'left' ? 'bg-accent' : ''}
          >
            Left aligned
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setNumberPosition('center'))}
            className={settings.numberPosition === 'center' ? 'bg-accent' : ''}
          >
            Center aligned
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setNumberPosition('right'))}
            className={settings.numberPosition === 'right' ? 'bg-accent' : ''}
          >
            Right aligned
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setNumberPosition('hide_segment'))}
            className={settings.numberPosition === 'hide_segment' ? 'bg-accent' : ''}
          >
            Hide segment numbers
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setNumberPosition('hide_all'))}
            className={settings.numberPosition === 'hide_all' ? 'bg-accent' : ''}
          >
            Hide segment numbers & ASD levels
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Labels Options */}
      <DropdownMenu>
        <DropdownMenuTrigger className={styles.optionButton}>
          <Settings className={styles.buttonIcon} />
          Labels
          <ChevronDown className={styles.chevronIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setLabelStyle('normal'))}
            className={settings.labelStyle === 'normal' ? 'bg-accent' : ''}
          >
            Normal weight
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setLabelStyle('bold'))}
            className={settings.labelStyle === 'bold' ? 'bg-accent' : ''}
          >
            Bold weight
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setLabelStyle('hidden'))}
            className={settings.labelStyle === 'hidden' ? 'bg-accent' : ''}
          >
            Hidden
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Icons Options */}
      <DropdownMenu>
        <DropdownMenuTrigger className={styles.optionButton}>
          <Settings className={styles.buttonIcon} />
          Icons
          <ChevronDown className={styles.chevronIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setShowIcons(true))}
            className={settings.showIcons ? 'bg-accent' : ''}
          >
            Show icons
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setShowIcons(false))}
            className={!settings.showIcons ? 'bg-accent' : ''}
          >
            Hide icons
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Theme Options */}
      <DropdownMenu>
        <DropdownMenuTrigger className={styles.optionButton}>
          <Settings className={styles.buttonIcon} />
          Theme
          <ChevronDown className={styles.chevronIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setTheme('system'))}
            className={settings.theme === 'system' ? 'bg-accent' : ''}
          >
            Use system
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setTheme('light'))}
            className={settings.theme === 'light' ? 'bg-accent' : ''}
          >
            Light
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => dispatch(appActions.setTheme('dark'))}
            className={settings.theme === 'dark' ? 'bg-accent' : ''}
          >
            Dark
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default ViewOptions;