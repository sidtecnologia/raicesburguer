import { useState, useEffect } from 'react';
import { BUSINESS_CONFIG } from '../config/businessConfig';

export const useStoreHours = () => {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: BUSINESS_CONFIG.schedule.timezone,
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
      });
      
      const parts = formatter.formatToParts(now);
      let hour = 0;
      let minute = 0;
      
      parts.forEach(part => {
        if (part.type === 'hour') hour = parseInt(part.value, 10);
        if (part.type === 'minute') minute = parseInt(part.value, 10);
      });
      
      const timeInMinutes = hour * 60 + minute;
      const openTime = BUSINESS_CONFIG.schedule.openHour * 60;
      const closeTime = BUSINESS_CONFIG.schedule.closeHour * 60;

      setIsOpen(timeInMinutes >= openTime && timeInMinutes < closeTime);
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  return isOpen;
};