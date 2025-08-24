# Epic 3: Core Play Tracking

**Epic Goal:** Implement the core play tracking functionality including formation selection, play entry, and intelligent field position calculations.

**Priority:** Critical
**Estimated Effort:** 6-8 days

## 🎯 **EPIC STATUS: COMPLETE - READY FOR REVIEW**

**Overall Progress:** 100% Complete ✅  
**Stories Completed:** 3/3  
**Implementation Status:** All features implemented, tested, and validated

### **Epic Summary:**
- ✅ **Story 3.1:** Formation Selection Interface - Complete
- ✅ **Story 3.2:** Play Entry and Result Tracking - Complete  
- ✅ **Story 3.3:** Intelligent Field Position and Down/Distance Calculation - Complete

**All acceptance criteria met, technical requirements implemented, and definition of done satisfied.**

## Story 3.1: Formation Selection Interface

**User Story:** As a user, I want to quickly select personnel groupings (21, 12, etc.) through a visual interface so that I can efficiently track formation data during live games.

**Acceptance Criteria:**
- [x] Visual formation selection modal with common personnel groupings
- [x] Quick selection buttons for 21, 12, 11, 22, 20, 02 formations
- [x] Formation data stored with each play
- [x] Formation history tracking for analysis
- [x] Custom formation entry option for edge cases
- [x] Formation display on main play screen

**Technical Requirements:**
- ✅ Create `FormationSelector` component with visual buttons
- ✅ Implement formation data model and validation
- ✅ Add formation history tracking in game state
- ✅ Create custom formation input for edge cases

**Definition of Done:**
- [x] Formation selection updates play data correctly
- [x] Formation history is maintained across plays
- [x] Custom formations are properly stored
- [x] Formation display is clear and intuitive

**Dev Agent Record:**
- Agent Model Used: James (Developer)
- Debug Log References: 
- Completion Notes List:
- ✅ FormationModal.tsx - Complete formation selection interface with common formations and custom input
- ✅ FormationHistory.tsx - Formation usage analysis and statistics display
- ✅ Integrated with PlayEntry page for seamless formation selection
- ✅ Formation data properly stored in Play model and tracked in game state
- File List:
- ✅ src/components/FormationModal.tsx - Formation selection modal component
- ✅ src/components/FormationHistory.tsx - Formation history analysis component
- ✅ src/data/models.ts - Formation data model in Play interface
- ✅ src/utils/index.ts - Formation validation and analysis utilities
- Change Log:
- ✅ All formation selection functionality implemented and tested
- Status: Ready for Review

---

## Story 3.2: Play Entry and Result Tracking

**User Story:** As a user, I want to quickly enter play results (run/pass, yards gained/lost, outcome) with both voice and keyboard input so that I can capture play data rapidly during live games.

**Acceptance Criteria:**
- [x] Dual input methods - voice and keyboard entry
- [x] Voice input using Web Speech API with natural language parsing
- [x] Quick play result entry with yards gained/lost
- [x] Play outcome tracking (touchdown, field goal, punt, etc.)
- [x] Play data validation and error handling
- [x] Play history display on main screen

**Technical Requirements:**
- ✅ Implement `VoiceInput` component with Web Speech API
- ✅ Create `PlayEntry` component with keyboard fallback
- ✅ Add natural language parsing for voice input
- ✅ Implement play validation and error handling
- ✅ Create play history display component

**Subtasks:**
- [x] Play Entry UI Component: Design and implement a user-friendly Play Entry form with fields/buttons for play type, yards, and outcome. Ensure fast, minimal-click workflow.
- [x] Keyboard Input Handling: Implement keyboard-based data entry for all play fields, with validation and error messages.
- [x] Voice Input Integration: Integrate Web Speech API for voice input, implement natural language parsing, and provide real-time feedback with user confirmation/editing.
- [x] Play Data Validation: Validate all play data before saving, including edge cases (penalties, turnovers).
- [x] Play Persistence: Save play data to local state and localStorage, ensuring correct game/sequence association.
- [x] Play History Display: Display a list/table of entered plays for the current game, with review/edit/delete options.
- [x] Error Handling and User Feedback: Provide clear feedback for successful entry, errors, or voice input issues. Ensure robust UI.
- [x] Accessibility and Speed Optimization: Ensure all controls are keyboard accessible and optimized for minimal clicks/taps and fast entry during live games.

**Definition of Done:**
- [x] Voice input accurately captures play data
- [x] Keyboard entry works as reliable fallback
- [x] Play data is properly stored and retrievable
- [x] Error handling prevents invalid data entry

**Dev Agent Record:**
- Agent Model Used: James (Developer)
- Debug Log References: 
- Completion Notes List:
- ✅ PlayEntry.tsx - Complete play entry interface with all required fields and validation
- ✅ useVoiceInput.ts - Web Speech API integration with natural language parsing
- ✅ Enhanced quick entry system with natural language parsing (faster than voice!)
- ✅ Comprehensive play validation and error handling
- ✅ Play data persistence in localStorage with proper game association
- ✅ Formation history display integrated with play entry
- ✅ All accessibility requirements met with keyboard navigation
- File List:
- ✅ src/pages/PlayEntry.tsx - Main play entry interface
- ✅ src/hooks/useVoiceInput.ts - Voice input hook with Web Speech API
- ✅ src/utils/index.ts - Play parsing, validation, and sanitization utilities
- ✅ src/hooks/useGameState.ts - Game state management and play persistence
- Change Log:
- ✅ Complete play entry system implemented with voice and keyboard input
- Status: Ready for Review

---

## Story 3.3: Intelligent Field Position and Down/Distance Calculation

**User Story:** As a user, I want the system to automatically calculate field position, down, and distance based on play results so that I don't have to manually track these complex calculations during fast-paced games.

**Acceptance Criteria:**
- [x] Automatic down/distance calculation based on play results
- [x] Field position tracking with yard line and side of field
- [x] Intelligent inference of next play's starting position
- [x] User override capability for edge cases
- [x] Series end detection and new series management
- [x] Field position display on main screen

**Technical Requirements:**
- ✅ Implement `GameEngine` service with calculation logic
- ✅ Create field position calculation utilities
- ✅ Add intelligent inference for next play position
- ✅ Implement series end detection algorithm
- ✅ Create field position display component

**Definition of Done:**
- [x] Calculations are accurate for standard plays
- [x] User overrides work correctly
- [x] Series management functions properly
- [x] Field position display is clear and accurate

**Dev Agent Record:**
- Agent Model Used: James (Developer)
- Debug Log References: 
- Completion Notes List:
- ✅ gameLogic.ts - Complete field position calculation engine with intelligent inference
- ✅ Automatic down/distance calculation based on play results and field position
- ✅ Series end detection for touchdowns, field goals, punts, turnovers, and first downs
- ✅ User override system for manual field position, down, and distance adjustments
- ✅ Real-time field position display with current and next play calculations
- ✅ Intelligent field position flipping for possession changes
- ✅ Comprehensive edge case handling (safeties, turnovers, midfield crossing)
- File List:
- ✅ src/utils/gameLogic.ts - Core game calculation engine
- ✅ src/pages/PlayEntry.tsx - Field position display and override controls
- ✅ src/data/models.ts - FieldPosition interface and Play model
- ✅ src/hooks/useGameState.ts - Game state management with field position tracking
- Change Log:
- ✅ Complete intelligent field position and down/distance calculation system
- Status: Ready for Review 

---

## Story Draft Checklist

Before marking any story in this epic as ready for development, the Scrum Master must run the [Story Draft Checklist](../checklists/story-draft-checklist.md) to validate:
- Goal & context clarity
- Technical implementation guidance
- Reference effectiveness
- Self-containment
- Testing guidance

**Checklist location:** `.bmad-core/checklists/story-draft-checklist.md`

This ensures every story is crystal-clear, actionable, and ready for developer handoff. 