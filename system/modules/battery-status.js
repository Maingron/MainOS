// Battery Status Module for MainOS Taskbar
// Implements Battery Status API with graceful degradation

export const BatteryStatus = function() {
    this.htmlElement = null;
    this.htmlElementImg = null;
    this.battery = null;
    this.isSupported = false;
    this.interval = null;
    this.lastLevel = -1;
    this.lastCharging = null;

    // Initialize battery status
    this.init = async function() {
        // Check if Battery Status API is supported
        if (!('getBattery' in navigator)) {
            this.isSupported = false;
            console.log('Battery Status API not supported');
            return false;
        }

        try {
            this.battery = await navigator.getBattery();
            this.isSupported = true;
            
            console.log('Battery API available:', {
                level: this.battery.level,
                charging: this.battery.charging,
                chargingTime: this.battery.chargingTime,
                dischargingTime: this.battery.dischargingTime
            });
            
            // Check if device is on battery power (not always charging)
            // We show the icon if the device has a battery, regardless of current charging state
            this.createBatteryElement();
            this.updateBatteryIcon();
            this.setupEventListeners();
            this.startUpdateInterval();
            
            console.log('Battery Status API initialized successfully - element created');
            return true;
        } catch (error) {
            console.log('Failed to initialize Battery Status API:', error);
            this.isSupported = false;
            return false;
        }
    };

    // Create the battery icon element in the taskbar
    this.createBatteryElement = function() {
        console.log('Creating battery element...');
        
        // Find the taskbar right icons container (same as online status)
        const taskbarRightIcons = document.getElementById('taskbarrighticons');
        if (!taskbarRightIcons) {
            console.error('Taskbar right icons container not found');
            return;
        }

        console.log('Found taskbar right icons container:', taskbarRightIcons);

        // Create battery status container
        this.htmlElement = document.createElement('a');
        this.htmlElement.className = 'taskbarbatterystatus';
        
        // Create image element
        this.htmlElementImg = document.createElement('img');
        this.htmlElementImg.className = 'icon';
        this.htmlElementImg.src = 'img/transparent.png'; // Default transparent image
        this.htmlElementImg.title = 'Battery Status';
        
        this.htmlElement.appendChild(this.htmlElementImg);
        taskbarRightIcons.appendChild(this.htmlElement);
        
        console.log('Battery element created and added to taskbar');
    };

    // Update battery icon based on current status
    this.updateBatteryIcon = function() {
        if (!this.battery || !this.htmlElementImg) {
            return;
        }

        const level = this.battery.level;
        const charging = this.battery.charging;
        
        // Only update if values have changed to avoid unnecessary DOM updates
        if (level === this.lastLevel && charging === this.lastCharging) {
            return;
        }

        this.lastLevel = level;
        this.lastCharging = charging;

        let iconName = '';
        const percentage = Math.round(level * 100);

        // Determine icon based on charging status and level
        if (charging) {
            iconName = 'battery-charging';
            this.htmlElementImg.title = `Battery: ${percentage}% (Charging)`;
        } else {
            // Choose icon based on battery level
            if (level <= 0.10) {
                iconName = 'battery-low';
                this.htmlElementImg.title = `Battery: ${percentage}% (Low)`;
            } else if (level <= 0.25) {
                iconName = 'battery-25';
                this.htmlElementImg.title = `Battery: ${percentage}%`;
            } else if (level <= 0.50) {
                iconName = 'battery-50';
                this.htmlElementImg.title = `Battery: ${percentage}%`;
            } else if (level <= 0.75) {
                iconName = 'battery-75';
                this.htmlElementImg.title = `Battery: ${percentage}%`;
            } else {
                iconName = 'battery-full';
                this.htmlElementImg.title = `Battery: ${percentage}%`;
            }
        }

        // Load appropriate icon based on dark mode preference
        const isDarkMode = system?.user?.settings?.prefersDarkMode;
        const iconSuffix = isDarkMode ? '-dark.svg' : '.svg';
        const iconPath = system.paths.icons.system + iconName + iconSuffix;
        
        // Try to load the icon using iofs, but fallback to direct path if iofs fails
        try {
            const iconUrl = iofs.load(iconPath, false);
            if (iconUrl && iconUrl !== 'null' && iconUrl !== null) {
                this.htmlElementImg.src = iconUrl;
            } else {
                // Fallback to direct path
                this.htmlElementImg.src = `system/icons/${iconName}${iconSuffix}`;
            }
        } catch (error) {
            console.log('Failed to load battery icon via iofs, using direct path:', error);
            // Fallback to direct path
            this.htmlElementImg.src = `system/icons/${iconName}${iconSuffix}`;
        }
    };

    // Setup event listeners for battery changes
    this.setupEventListeners = function() {
        if (!this.battery) {
            return;
        }

        // Listen for battery level changes
        this.battery.addEventListener('levelchange', () => {
            this.updateBatteryIcon();
        });

        // Listen for charging status changes
        this.battery.addEventListener('chargingchange', () => {
            this.updateBatteryIcon();
        });
    };

    // Start periodic update interval as backup
    this.startUpdateInterval = function() {
        this.interval = setInterval(() => {
            this.updateBatteryIcon();
        }, 30000); // Update every 30 seconds
    };

    // Hide battery icon (for cleanup or when API becomes unavailable)
    this.hide = function() {
        if (this.htmlElement) {
            this.htmlElement.classList.add('hidden');
        }
    };

    // Show battery icon
    this.show = function() {
        if (this.htmlElement) {
            this.htmlElement.classList.remove('hidden');
        }
    };

    // Cleanup function
    this.destroy = function() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        
        if (this.htmlElement && this.htmlElement.parentNode) {
            this.htmlElement.parentNode.removeChild(this.htmlElement);
        }
        
        this.htmlElement = null;
        this.htmlElementImg = null;
        this.battery = null;
    };
};