export const BUSINESS_CONFIG = {
  name: "Raíces Burger",
  nameParts: { main: "Raíces", accent: "Burger" },
  slogan: "Cocina Oculta",
  logo: "/img/favicon.png",
  phone: "3227671829",
  phoneRaw: "3227671829",
  whatsappNumber: "573227671829",
  address: "Dirección secreta, Cúcuta",
  addressLabel: "Cocina Oculta, Cúcuta",
  mapsUrl: "https://maps.google.com/",
  schedule: {
    label: "Lun - Dom: 4:00 pm - 11:00 pm",
    openHour: 16,
    closeHour: 23,
    timezone: "America/Bogota",
    days: "Lunes a Domingo"
  },
  payment: {
    nequi: {
      number: "3227671829",
      qrImage: "https://upload.wikimedia.org/wikipedia/commons/d/d7/Commons_QR_code.png",
      holderName: "Raíces Burger"
    }
  }
};

export const isBusinessOpen = () => {
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: BUSINESS_CONFIG.schedule.timezone }));
  const hour = now.getHours();
  const { openHour, closeHour } = BUSINESS_CONFIG.schedule;
  return hour >= openHour && hour < closeHour;
};