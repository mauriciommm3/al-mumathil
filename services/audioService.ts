
class AudioService {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playStartSound() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Frequência base: C5 (Dó) - Elegante e claro
    const fundamental = 523.25; 
    
    // Relações harmônicas e inarmônicas típicas de sinos de bronze (Tubular Bells)
    // Cada par representa [multiplicador de frequência, ganho relativo, tempo de decaimento]
    const partials: [number, number, number][] = [
      [0.5, 0.4, 2.0],   // Hum tone (oitava abaixo, corpo do som)
      [1.0, 0.8, 1.5],   // Tom principal (Prime)
      [1.2, 0.3, 1.2],   // Terça menor (Dá o caráter melancólico/clássico do sino)
      [1.5, 0.2, 1.0],   // Quinta
      [2.0, 0.4, 0.8],   // Oitava acima
      [2.76, 0.3, 0.6],  // Parcial inarmônico (brilho metálico)
      [3.0, 0.2, 0.5],   // Super oitava
      [5.4, 0.1, 0.3]    // Brilho agudo extremo
    ];

    const masterGain = this.ctx.createGain();
    masterGain.connect(this.ctx.destination);
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.6, now + 0.005);
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

    partials.forEach(([mult, vol, decay]) => {
      const osc = this.ctx!.createOscillator();
      const pGain = this.ctx!.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(fundamental * mult, now);

      pGain.gain.setValueAtTime(0, now);
      pGain.gain.linearRampToValueAtTime(vol, now + 0.002);
      pGain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(pGain);
      pGain.connect(masterGain);

      osc.start(now);
      osc.stop(now + decay + 0.1);
    });
  }

  playTick() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Tom de clique mais suave, estilo Apple Watch
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.04);
    
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(now + 0.04);
  }

  playAlarm() {
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    const playSoftBeep = (time: number, freq: number) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.1, time + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(time);
      osc.stop(time + 0.5);
    };

    // Alarme em tríade maior para soar resolutivo mas não agressivo
    playSoftBeep(now, 523.25); // C5
    playSoftBeep(now + 0.15, 659.25); // E5
    playSoftBeep(now + 0.3, 783.99); // G5
  }
}

export const audioService = new AudioService();
