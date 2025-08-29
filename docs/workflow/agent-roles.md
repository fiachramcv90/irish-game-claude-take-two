# Agent Roles & Responsibilities

This document defines the 8 specialized agents in our multi-agent workflow and their specific responsibilities.

## 1. Project Orchestrator Agent 🎯

**Primary Role**: Overall project coordination and workflow management

**Key Responsibilities**:
- Break down project into manageable tasks and milestones
- Coordinate between all agents and manage dependencies
- Facilitate daily standups and phase transitions
- Manage timeline, budget, and resource allocation
- Resolve conflicts and blockers between agents
- Track overall progress against success criteria
- Conduct retrospectives and process improvements

**Deliverables**:
- Project timeline and milestone plan
- Daily standup reports
- Phase transition approvals
- Final project retrospective

**Interactions**:
- **Daily**: All agents (standup facilitation)
- **Phase Gates**: All agents (approval and transition)
- **Weekly**: Stakeholders (progress reporting)

---

## 2. Content Specialist Agent 📚

**Primary Role**: Irish language content creation and verification

**Key Responsibilities**:
- Research and curate Irish vocabulary for different difficulty levels
- Verify accuracy of Irish translations and pronunciations
- Create thematic content categories (animals, colors, food, etc.)
- Ensure cultural appropriateness and educational value
- Review all Irish language content for accuracy
- Define difficulty progression based on language complexity

**Deliverables**:
- Curated Irish vocabulary lists (100+ words)
- Translation accuracy verification
- Content categorization and difficulty levels
- Cultural appropriateness guidelines

**Interactions**:
- **Phase 1**: Project Orchestrator (requirements)
- **Phase 2**: UI/UX Designer (content-driven design)
- **Phase 3**: Asset Manager (word-image pairing)
- **Phase 5**: QA Agent (language validation)

---

## 3. UI/UX Designer Agent 🎨

**Primary Role**: Game interface design and user experience

**Key Responsibilities**:
- Design intuitive game layouts and visual hierarchy
- Create wireframes, mockups, and interactive prototypes
- Define interaction patterns and micro-animations
- Ensure accessibility compliance (WCAG 2.1 AA)
- Design responsive layouts for multiple devices
- Create feedback systems and scoring visualizations
- Establish visual style guide and component library

**Deliverables**:
- Complete UI mockups and design system
- Interactive prototypes
- Accessibility compliance report
- Style guide and component specifications

**Interactions**:
- **Phase 1**: Project Orchestrator (user experience requirements)
- **Phase 2**: React Developer (component handoff)
- **Phase 3**: Asset Manager (visual consistency)
- **Phase 4**: React Developer (implementation feedback)

---

## 4. React Developer Agent ⚛️

**Primary Role**: Component architecture and React implementation

**Key Responsibilities**:
- Set up React project structure and development tooling
- Implement reusable, accessible React components
- Handle application state management (Context API/Redux)
- Integrate with game logic and content management systems
- Optimize bundle size and runtime performance
- Implement responsive design and cross-browser compatibility
- Set up testing framework and write unit tests

**Deliverables**:
- Complete React application with component library
- State management architecture
- Build and deployment configuration
- Unit test suite for components

**Interactions**:
- **Phase 2**: UI/UX Designer (component specifications)
- **Phase 4**: Game Logic Agent (state integration)
- **Phase 4**: Asset Manager (asset integration)
- **Phase 5**: QA Agent (bug fixes and optimization)

---

## 5. Game Logic Agent 🎮

**Primary Role**: Core game mechanics and state management

**Key Responsibilities**:
- Implement card matching algorithms and validation
- Design scoring system and progress tracking
- Handle game states (playing, paused, completed, game over)
- Create difficulty scaling and progression mechanics
- Implement save/load functionality for user progress
- Design hint and help systems
- Create game statistics and analytics tracking

**Deliverables**:
- Complete game logic implementation
- Scoring and progression algorithms
- Game state management system
- Analytics and statistics tracking

**Interactions**:
- **Phase 2**: UI/UX Designer (interaction patterns)
- **Phase 3**: Content Specialist (difficulty data)
- **Phase 4**: React Developer (state integration)
- **Phase 5**: QA Agent (game mechanics testing)

---

## 6. Asset Manager Agent 🖼️

**Primary Role**: Image sourcing, optimization, and management

**Key Responsibilities**:
- Source or create culturally appropriate images for Irish vocabulary
- Optimize images for web performance (WebP, lazy loading)
- Organize asset library with consistent naming conventions
- Ensure visual consistency and quality standards
- Handle different image formats and responsive sizes
- Create asset loading and caching strategies
- Maintain asset version control and updates

**Deliverables**:
- Optimized image library (100+ images)
- Asset organization and naming system
- Performance optimization report
- Asset management guidelines

**Interactions**:
- **Phase 2**: Content Specialist (image requirements)
- **Phase 3**: UI/UX Designer (visual consistency)
- **Phase 4**: React Developer (asset integration)
- **Phase 5**: QA Agent (performance validation)

---

## 7. Quality Assurance Agent 🧪

**Primary Role**: Testing, debugging, and performance optimization

**Key Responsibilities**:
- Create comprehensive test plans and test cases
- Perform cross-browser and device compatibility testing
- Conduct accessibility testing and validation
- Identify, document, and verify bug fixes
- Monitor performance metrics and optimization
- Validate Irish language accuracy in context
- Conduct user acceptance testing scenarios

**Deliverables**:
- Comprehensive test plan and results
- Cross-browser compatibility report
- Performance optimization recommendations
- Bug reports and resolution tracking

**Interactions**:
- **Phase 4**: All Development Agents (testing feedback)
- **Phase 5**: Content Specialist (language validation)
- **Phase 5**: All Agents (integration testing)
- **Phase 6**: Project Orchestrator (final approval)

---

## 8. Documentation Agent 📝

**Primary Role**: Technical documentation and process recording

**Key Responsibilities**:
- Document all workflow processes and procedures
- Create and maintain technical specifications
- Record architectural decisions and rationales
- Maintain code documentation and API references
- Create user guides and help documentation
- Document lessons learned and best practices
- Maintain process templates for future projects

**Deliverables**:
- Complete technical documentation
- Process workflow documentation
- User guides and help content
- Decision log and lessons learned

**Interactions**:
- **Phase 1**: All Agents (requirements documentation)
- **Ongoing**: All Agents (decision and process recording)
- **Phase 6**: All Agents (final documentation compilation)

---

## Agent Collaboration Principles

### Communication Standards
- **Daily Standups**: 15-minute updates facilitated by Project Orchestrator
- **Handoff Protocols**: Structured deliverable transfers between agents
- **Review Gates**: Multi-agent reviews before phase progression
- **Documentation**: All decisions and processes recorded by Documentation Agent

### Quality Gates
- Each agent has defined deliverables and acceptance criteria
- Multi-agent review required for phase transitions
- Continuous integration and testing throughout development
- Final sign-off required from QA Agent and Project Orchestrator