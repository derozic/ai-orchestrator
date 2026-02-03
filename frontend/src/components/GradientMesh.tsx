'use client';

import { useEffect, useRef } from 'react';

export function GradientMesh() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // 2ndbrain-inspired color palette
    const colors = [
      { r: 14, g: 165, b: 233, a: 0.4 },    // Sky blue (2ndbrain primary)
      { r: 2, g: 132, b: 199, a: 0.4 },     // Deeper blue
      { r: 124, g: 58, b: 237, a: 0.3 },    // Purple
      { r: 236, g: 72, b: 153, a: 0.3 },    // Pink
      { r: 52, g: 211, b: 153, a: 0.25 },   // Emerald
      { r: 251, g: 146, b: 60, a: 0.25 },   // Orange
    ];

    // Mesh points
    const points: any[] = [];
    const pointCount = 6;
    
    for (let i = 0; i < pointCount; i++) {
      points.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 250 + Math.random() * 350,
        color: colors[i % colors.length],
        phase: Math.random() * Math.PI * 2,
        frequency: 0.001 + Math.random() * 0.002
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      time += 1;
      
      // Clear with very dark background
      ctx.fillStyle = 'rgb(5, 5, 10)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw mesh points
      points.forEach((point, i) => {
        // Organic movement with sine waves
        point.x += point.vx + Math.sin(time * point.frequency + point.phase) * 0.3;
        point.y += point.vy + Math.cos(time * point.frequency + point.phase) * 0.3;
        
        // Bounce off edges smoothly
        if (point.x < -point.radius || point.x > canvas.width + point.radius) {
          point.vx *= -0.95;
          point.x = Math.max(-point.radius, Math.min(canvas.width + point.radius, point.x));
        }
        if (point.y < -point.radius || point.y > canvas.height + point.radius) {
          point.vy *= -0.95;
          point.y = Math.max(-point.radius, Math.min(canvas.height + point.radius, point.y));
        }
        
        // Create radial gradient
        const gradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, point.radius
        );
        
        const c = point.color;
        const pulseAlpha = c.a + Math.sin(time * 0.008 + i) * 0.1;
        
        gradient.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, ${pulseAlpha})`);
        gradient.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, ${pulseAlpha * 0.5})`);
        gradient.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });
      
      // Add subtle mesh connections
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.03)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 400) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.globalAlpha = (1 - distance / 400) * 0.15;
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      }
      
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();
    
    window.addEventListener('resize', resize);
    
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10"
      style={{
        filter: 'blur(50px) saturate(120%)',
        opacity: 0.6,
      }}
    />
  );
}