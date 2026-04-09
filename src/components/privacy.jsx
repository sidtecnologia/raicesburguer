import React from 'react';

export const PrivacyContent = () => {
    return (
        <div className="text-white/80 leading-relaxed text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <h2 className="text-xl font-bold text-amber-400 border-b border-white/10 pb-2 mb-4">
                1. Responsable del Tratamiento
            </h2>
            <p className="mb-4">
                El responsable del tratamiento de sus datos personales es <strong>Raices Burger Cocina Oculta</strong>. Sus datos se usarán exclusivamente para procesar y entregar su pedido.
            </p>

            <h2 className="text-xl font-bold text-amber-400 border-b border-white/10 pb-2 mb-4">
                2. Datos Recopilados
            </h2>
            <ul className="list-disc pl-5 mb-4 space-y-1">
                <li><strong>Nombre:</strong> Para identificar su pedido.</li>
                <li><strong>Dirección:</strong> Para la logística de entrega.</li>
                <li><strong>Teléfono:</strong> Para contacto en caso de novedades.</li>
            </ul>

            <h2 className="text-xl font-bold text-amber-400 border-b border-white/10 pb-2 mb-4">
                3. Finalidad
            </h2>
            <p className="mb-4">
                La información se utiliza únicamente para la gestión de la compra actual y no se comparte con terceros con fines publicitarios sin su consentimiento.
            </p>
        </div>
    );
};