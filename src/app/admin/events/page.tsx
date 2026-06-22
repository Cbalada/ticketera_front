"use client";

import { useState } from 'react';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { useEvents } from '@/hooks/useEvents';
import { useCreateEvent } from '@/hooks/useCreateEvent';
import { useUpdateEvent } from '@/hooks/useUpdateEvent';
import { useDeleteEvent } from '@/hooks/useDeleteEvent';
import { Event, Sector } from '@/types';

const SECTOR_OPTIONS: Sector[] = ['VIP', 'CAMPO', 'PLATEA_A', 'PLATEA_B'];

function formatDate(iso?: string) {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AdminEventsPage() {
  const { data: events, isLoading, isError, refetch } = useEvents();
  const createMutation = useCreateEvent();
  const updateMutation = useUpdateEvent();
  const deleteMutation = useDeleteEvent();

  const [showCreate, setShowCreate] = useState(false);
  const [showSuccess, setShowSuccess] = useState<string | null>(null);
  const [selected, setSelected] = useState<Event | null>(null);
  const [editMode, setEditMode] = useState(false);

  // Form state
  const emptyForm = {
    title: '',
    description: '',
    imageUrl: '',
    date: '',
    sectors: [] as { sector: Sector; price: number | ''; capacity: number | '' }[],
  };

  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setForm(emptyForm);
    setEditMode(false);
    setShowCreate(true);
  };

  const openEdit = (event: Event) => {
    setForm({
      title: event.title,
      description: event.description,
      imageUrl: event.imageUrl,
      date: new Date(event.date).toISOString().slice(0, 16), // datetime-local value
      sectors: event.sectors.map((s) => ({ sector: s.sector as Sector, price: Number(s.price), capacity: s.capacity })),
    });
    setEditMode(true);
    setSelected(event);
    setShowCreate(true);
  };

  const addSector = () => {
    setForm((f) => ({ ...f, sectors: [...f.sectors, { sector: 'VIP', price: '', capacity: '' }] }));
  };

  const removeSector = (index: number) => {
    setForm((f) => ({ ...f, sectors: f.sectors.filter((_, i) => i !== index) }));
  };

  const updateSector = (index: number, field: string, value: any) => {
    setForm((f) => ({
      ...f,
      sectors: f.sectors.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
    }));
  };

  const validate = () => {
    if (!form.title || !form.description || !form.imageUrl || !form.date) return 'Todos los campos son obligatorios';
    if (!form.sectors.length) return 'Debe existir al menos un sector';
    const seen = new Set<string>();
    for (const s of form.sectors) {
      if (!s.sector || s.price === '' || s.capacity === '') return 'Todos los campos de sector son obligatorios';
      if (Number(s.price) <= 0) return 'El precio debe ser mayor a 0';
      if (Number(s.capacity) <= 0) return 'La capacidad debe ser mayor a 0';
      if (seen.has(s.sector)) return 'No permitir sectores repetidos';
      seen.add(s.sector);
    }
    // date validity
    if (isNaN(new Date(form.date).getTime())) return 'Formato de fecha inválido';
    return null;
  };

  const toPayload = () => ({
    title: form.title,
    description: form.description,
    imageUrl: form.imageUrl,
    date: new Date(form.date).toISOString(),
    sectors: form.sectors.map((s) => ({ sector: s.sector, price: Number(s.price), capacity: Number(s.capacity) })),
  });

  const handleSubmit = async () => {
    const v = validate();
    if (v) return alert(v);
    try {
      if (editMode && selected) {
        await updateMutation.mutateAsync({ id: selected.id, data: toPayload() as any });
        setShowCreate(false);
        setShowSuccess('Evento actualizado correctamente');
      } else {
        await createMutation.mutateAsync(toPayload() as any);
        setShowCreate(false);
        setShowSuccess('Evento creado correctamente');
      }
      // refetch not strictly necessary because hooks invalidate, but ensure
      refetch();
    } catch (err: any) {
      alert(err?.message || 'Error en la operación');
    }
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    const confirmed = confirm('¿Está seguro que desea eliminar este evento?\nEsta acción no puede deshacerse.');
    if (!confirmed) return;
    try {
      await deleteMutation.mutateAsync(id);
      setSelected(null);
      setShowSuccess('Evento eliminado correctamente');
    } catch (err: any) {
      alert(err?.message || 'Error al eliminar');
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-24 px-6 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-display font-extrabold text-white">Panel de Eventos</h1>
            <p className="text-on-surface-variant mt-2">Gestión de eventos (solo administradores)</p>
          </div>
          <div>
            <button onClick={openCreate} className="bg-primary-fixed text-black px-4 py-2 rounded-full font-bold">+ Crear Evento</button>
          </div>
        </div>

        <div>
          {isLoading && <div className="text-on-surface-variant">Cargando eventos...</div>}
          {isError && <div className="text-error">Error cargando eventos</div>}
          {!isLoading && events && events.length === 0 && <div className="text-on-surface-variant">No hay eventos</div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {events?.map((ev) => (
              <div key={ev.id} className="glass-panel rounded-xl overflow-hidden border border-white/5 p-4 hover:shadow-md cursor-pointer" onClick={() => setSelected(ev)}>
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-4">
                  <img className="w-full h-full object-cover" src={ev.imageUrl} alt={ev.title} />
                </div>
                <h3 className="text-xl font-bold text-white">{ev.title}</h3>
                <p className="text-on-surface-variant text-sm">{formatDate(ev.date)}</p>
                <div className="mt-3 text-on-surface-variant text-sm">Sectores: {ev.sectors?.length ?? 0}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />

      {/* Create / Edit Modal */}
      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="glass-panel max-w-3xl w-full rounded-xxl p-6 relative overflow-auto" style={{ maxHeight: '90vh' }}>
            <h2 className="text-2xl font-bold text-white mb-4">{editMode ? 'Editar Evento' : 'Crear Evento'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-on-surface-variant text-sm">Título</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-surface-container px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-on-surface-variant text-sm">Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-surface-container px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-on-surface-variant text-sm">Imagen (URL)</label>
                <input value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full bg-surface-container px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-on-surface-variant text-sm">Fecha y hora</label>
                <input value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} type="datetime-local" className="w-full bg-surface-container px-3 py-2 rounded" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-on-surface-variant text-sm">Sectores</label>
                  <button onClick={addSector} className="text-primary-fixed text-sm">+ Agregar Sector</button>
                </div>
                <div className="space-y-3">
                  {form.sectors.map((s, idx) => (
                    <div key={idx} className="p-3 bg-surface-container rounded flex gap-3 items-end">
                      <div className="w-40">
                        <label className="text-xs text-on-surface-variant">Sector</label>
                        <select value={s.sector} onChange={(e) => updateSector(idx, 'sector', e.target.value)} className="w-full mt-1 rounded px-2 py-2 bg-surface-container">
                          {SECTOR_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-on-surface-variant">Precio</label>
                        <input type="number" min={1} value={s.price as any} onChange={(e) => updateSector(idx, 'price', e.target.value)} className="w-full mt-1 rounded px-2 py-2 bg-surface-container" />
                      </div>
                      <div className="w-36">
                        <label className="text-xs text-on-surface-variant">Capacidad</label>
                        <input type="number" min={1} value={s.capacity as any} onChange={(e) => updateSector(idx, 'capacity', e.target.value)} className="w-full mt-1 rounded px-2 py-2 bg-surface-container" />
                      </div>
                      <div>
                        <button onClick={() => removeSector(idx)} className="text-error text-sm">Eliminar</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowCreate(false)} className="px-4 py-2 rounded bg-white/5">Cancelar</button>
                {(() => {
                  const creating = (createMutation as any).isLoading ?? createMutation.status === 'pending';
                  const updating = (updateMutation as any).isLoading ?? updateMutation.status === 'pending';
                  const busy = creating || updating;
                  return (
                    <button onClick={handleSubmit} disabled={busy} className="px-4 py-2 rounded bg-primary-fixed text-black font-bold">{busy ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}</button>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail / Edit / Delete modal */}
      {selected && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 bg-black/60">
          <div className="glass-panel max-w-2xl w-full rounded-xxl p-6 relative overflow-auto">
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4">Cerrar</button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <div className="aspect-[4/3] rounded overflow-hidden mb-4">
                  <img src={selected.imageUrl} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold text-white">{selected.title}</h2>
                <p className="text-on-surface-variant mb-2">{formatDate(selected.date)}</p>
                <p className="text-on-surface-variant mb-4">{selected.description}</p>

                <h3 className="font-bold text-white">Sectores</h3>
                <div className="mt-2 space-y-2">
                  {selected.sectors.map((s) => (
                    <div key={s.id} className="p-3 bg-surface-container rounded flex justify-between">
                      <div>
                        <div className="font-bold text-white">{s.sector}</div>
                        <div className="text-on-surface-variant text-sm">Precio: ${Number(s.price).toLocaleString()}</div>
                        <div className="text-on-surface-variant text-sm">Capacidad: {s.capacity}</div>
                        <div className="text-on-surface-variant text-sm">Disponibles: {s.availableQuantity ?? '-'}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => openEdit(selected)} className="px-4 py-2 rounded bg-primary-fixed text-black font-bold">Editar Evento</button>
                  <button onClick={() => handleDelete(selected.id)} className="px-4 py-2 rounded bg-error text-white">Eliminar Evento</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast/Modal */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-[110]">
          <div className="glass-panel rounded px-6 py-4 border border-white/5">
            <div className="font-bold">{showSuccess}</div>
            <div className="mt-3 flex justify-end">
              <button onClick={() => setShowSuccess(null)} className="text-primary-fixed">Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
