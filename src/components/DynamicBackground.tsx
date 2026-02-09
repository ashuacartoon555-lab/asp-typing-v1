const DynamicBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      {/* Primary Teal/Cyan Gradient Orb */}
      <div 
        className="absolute top-0 -left-1/4 w-[700px] h-[700px] rounded-full blur-[150px] opacity-40"
        style={{ background: 'radial-gradient(circle, hsla(178, 72%, 45%, 0.25) 0%, transparent 70%)' }}
      />
      
      {/* Secondary Orange/Yellow Gradient Orb */}
      <div 
        className="absolute top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30"
        style={{ 
          background: 'radial-gradient(circle, hsla(42, 98%, 58%, 0.15) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      
      {/* Bottom accent orb */}
      <div 
        className="absolute -bottom-1/4 left-1/3 w-[500px] h-[500px] rounded-full blur-[100px] opacity-25"
        style={{ 
          background: 'radial-gradient(circle, hsla(178, 72%, 45%, 0.15) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite reverse'
        }}
      />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(hsla(0, 0%, 100%, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, hsla(0, 0%, 100%, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />
    </div>
  );
};

export default DynamicBackground;
