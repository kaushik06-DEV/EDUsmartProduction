#!/bin/bash

echo "=== Network Information for Mobile Access ==="
echo ""
echo "Your computer's IP addresses:"
echo ""

# Get the primary network interface IP
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    echo "Wi-Fi IP:"
    ipconfig getifaddr en0 2>/dev/null || echo "Not connected via Wi-Fi"
    
    echo ""
    echo "Ethernet IP:"
    ipconfig getifaddr en1 2>/dev/null || echo "Not connected via Ethernet"
    
    echo ""
    echo "All network interfaces:"
    ifconfig | grep -E "inet [0-9]" | grep -v "127.0.0.1"
else
    # Linux
    echo "Available IP addresses:"
    hostname -I
fi

echo ""
echo "=== Access Instructions ==="
echo "1. Start your development server: npm run dev"
echo "2. On your mobile device, connect to the same Wi-Fi network"
echo "3. Open browser and use one of the IP addresses above with port 5173"
echo "   Example: http://192.168.1.100:5173"
echo ""
echo "Note: Make sure your firewall allows connections on port 5173"
