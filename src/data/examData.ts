export const examPatterns = {
  'ssc-cgl': {
    title: "SSC CGL",
    fullName: "Staff Selection Commission - Combined Graduate Level",
    duration: 15 * 60, // 15 minutes in seconds
    requiredSpeed: 35, // WPM
    requiredAccuracy: 85,
    keyDepressions: 1750,
    passages: [
      "The Staff Selection Commission conducts examinations for recruitment to various posts in the ministries and departments of the Government of India. The typing test is conducted for posts like Tax Assistant, Junior Accountant, and other clerical positions. Candidates are required to demonstrate proficiency in typing with accuracy and speed.",
      "India is a diverse country with a rich cultural heritage spanning thousands of years. The nation celebrates numerous festivals throughout the year, each reflecting the unique traditions of its various regions. From the colorful Holi to the luminous Diwali, these celebrations bring communities together in harmony.",
      "The digital revolution has transformed the way government offices function. E-governance initiatives have made public services more accessible and transparent. Citizens can now apply for various documents, pay taxes, and access government schemes through online portals, reducing paperwork and increasing efficiency."
    ]
  },
  'ssc-chsl': {
    title: "SSC CHSL",
    fullName: "Combined Higher Secondary Level - Data Entry Operator",
    duration: 15 * 60,
    requiredSpeed: 35,
    requiredAccuracy: 85,
    keyDepressions: 8000,
    passages: [
      "Data entry is a crucial function in modern offices. Accuracy and speed are essential qualities for a data entry operator. The work involves entering information from various sources into computer systems, maintaining databases, and ensuring the integrity of stored data.",
      "The Government of India has launched several schemes for the welfare of citizens. The Pradhan Mantri Jan Dhan Yojana aims to provide financial inclusion to all. Similarly, the Digital India initiative focuses on transforming India into a digitally empowered society and knowledge economy.",
      "Environmental conservation has become a global priority. Climate change poses significant challenges to sustainable development. Governments worldwide are implementing policies to reduce carbon emissions, promote renewable energy, and protect natural habitats for future generations."
    ]
  },
  'ibps-clerk': {
    title: "IBPS Clerk",
    fullName: "Institute of Banking Personnel Selection - Clerk",
    duration: 10 * 60,
    requiredSpeed: 30,
    requiredAccuracy: 85,
    passages: [
      "Banking sector plays a vital role in the economic development of any nation. Banks mobilize savings from the public and channel them into productive investments. They provide various financial services including loans, deposits, and money transfer facilities to individuals and businesses.",
      "The Reserve Bank of India is the central banking institution of India. It controls the monetary policy of the Indian rupee and regulates the country's financial system. RBI issues currency notes, manages foreign exchange, and works to maintain price stability.",
      "Customer service is paramount in the banking industry. Bank employees must handle customer queries efficiently and courteously. From account opening to loan processing, every interaction should reflect professionalism and commitment to customer satisfaction."
    ]
  },
  'rrb-ntpc': {
    title: "RRB NTPC",
    fullName: "Railway Recruitment Board - Non Technical Popular Categories",
    duration: 10 * 60,
    requiredSpeed: 30,
    requiredAccuracy: 85,
    passages: [
      "Indian Railways is one of the largest railway networks in the world. It connects the length and breadth of the country, serving millions of passengers daily. The railways play a crucial role in transportation of goods and passengers, contributing significantly to the nation's economy.",
      "Safety is the top priority for Indian Railways. Regular maintenance of tracks, bridges, and rolling stock ensures smooth operations. Modern signaling systems and technology upgrades are continuously being implemented to enhance the safety and efficiency of rail travel.",
      "The railway recruitment process is conducted by various Railway Recruitment Boards across India. Candidates aspiring for non-technical posts must demonstrate proficiency in basic computer operations and typing skills as per the requirements of their respective positions."
    ]
  },
  'high-court': {
    title: "High Court",
    fullName: "High Court Stenographer and Typist",
    duration: 10 * 60,
    requiredSpeed: 35,
    requiredAccuracy: 90,
    passages: [
      "The judiciary is an independent pillar of democracy in India. High Courts function as the highest judicial authority at the state level. They have the power to issue writs for enforcement of fundamental rights and handle appeals from subordinate courts.",
      "Legal documentation requires precision and accuracy. Court orders, judgments, and legal notices must be typed with utmost care to ensure clarity and correctness. A single typographical error can change the meaning of a legal document significantly.",
      "The Constitution of India guarantees the right to justice to all citizens. The judicial system ensures that disputes are resolved fairly and impartially. Courts at various levels work together to uphold the rule of law and protect the rights of individuals."
    ]
  },
  'cpct': {
    title: "CPCT",
    fullName: "Computer Proficiency Certification Test - MP Online",
    duration: 15 * 60,
    requiredSpeed: 30,
    requiredAccuracy: 85,
    passages: [
      "Computer literacy has become essential in the modern workplace. Proficiency in basic computer operations including word processing, spreadsheet management, and internet usage is required for most government and private sector jobs.",
      "Madhya Pradesh State Government conducts the Computer Proficiency Certification Test to assess the computer skills of candidates. The test evaluates typing speed and accuracy along with knowledge of various computer applications and concepts.",
      "Digital literacy initiatives in India aim to make every citizen capable of using digital services. From online banking to e-governance portals, computer skills open doors to numerous opportunities and make daily tasks more convenient."
    ]
  }
};

export type ExamType = keyof typeof examPatterns;
