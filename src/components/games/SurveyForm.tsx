import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface SurveyFormProps {
  onClose: () => void;
}

export const SurveyForm = ({ onClose }: SurveyFormProps) => {
  const [formData, setFormData] = useState({
    nombre: "",
    dni: "",
    telefono: "",
    distrito: "",
  });

  const handleFormSubmit = () => {
    const { nombre, dni, telefono, distrito } = formData;
    if (!nombre || !dni || !telefono || !distrito) {
      return;
    }

    const message = encodeURIComponent(
      `🎮 ¡NUEVO GANADOR DEL JUEGO CEVATUR!\n\n` +
      `👤 Nombre: ${nombre}\n` +
      `🆔 DNI: ${dni}\n` +
      `📞 Teléfono: ${telefono}\n` +
      `📍 Distrito: ${distrito}\n\n` +
      `¡Quiero inscribirme en CEVATUR!`
    );

    window.open(`https://wa.me/51999999999?text=${message}`, "_blank");
    onClose();
  };

  return (
    <motion.div
      className="p-6 sm:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-6">
        📝 Completa tus Datos
      </h2>

      <div className="space-y-4">
        <div>
          <Label className="text-white mb-2 block">Nombre Completo</Label>
          <Input
            placeholder="Ingresa tu nombre"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div>
          <Label className="text-white mb-2 block">DNI</Label>
          <Input
            placeholder="Ingresa tu DNI"
            value={formData.dni}
            onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            maxLength={8}
          />
        </div>

        <div>
          <Label className="text-white mb-2 block">Teléfono</Label>
          <Input
            placeholder="Ingresa tu teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <div>
          <Label className="text-white mb-2 block">Distrito</Label>
          <Input
            placeholder="Ingresa tu distrito"
            value={formData.distrito}
            onChange={(e) => setFormData({ ...formData, distrito: e.target.value })}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
          />
        </div>

        <Button
          onClick={handleFormSubmit}
          disabled={!formData.nombre || !formData.dni || !formData.telefono || !formData.distrito}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-6 mt-4 disabled:opacity-50"
        >
          📱 Enviar por WhatsApp
        </Button>
      </div>
    </motion.div>
  );
};
