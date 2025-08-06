# Epic 3: Core Play Tracking

**Epic Goal:** Implement the core play tracking functionality including formation selection, play entry, and intelligent field position calculations.

**Priority:** Critical
**Estimated Effort:** 6-8 days

## Story 3.1: Formation Selection Interface

**User Story:** As a user, I want to quickly select personnel groupings (21, 12, etc.) through a visual interface so that I can efficiently track formation data during live games.

**Acceptance Criteria:**
- [ ] Visual formation selection modal with common personnel groupings
- [ ] Quick selection buttons for 21, 12, 11, 22, 20, 02 formations
- [ ] Formation data stored with each play
- [ ] Formation history tracking for analysis
- [ ] Custom formation entry option for edge cases
- [ ] Formation display on main play screen

**Technical Requirements:**
- Create `FormationSelector` component with visual buttons
- Implement formation data model and validation
- Add formation history tracking in game state
- Create custom formation input for edge cases

**Definition of Done:**
- [ ] Formation selection updates play data correctly
- [ ] Formation history is maintained across plays
- [ ] Custom formations are properly stored
- [ ] Formation display is clear and intuitive

**Dev Agent Record:**
- Agent Model Used: James (Developer)
- Debug Log References: 
- Completion Notes List:
- File List:
- Change Log:
- Status: Not Started

---

## Story 3.2: Play Entry and Result Tracking

**User Story:** As a user, I want to quickly enter play results (run/pass, yards gained/lost, outcome) with both voice and keyboard input so that I can capture play data rapidly during live games.

**Acceptance Criteria:**
- [ ] Dual input methods - voice and keyboard entry
- [ ] Voice input using Web Speech API with natural language parsing
- [ ] Quick play result entry with yards gained/lost
- [ ] Play outcome tracking (touchdown, field goal, punt, etc.)
- [ ] Play data validation and error handling
- [ ] Play history display on main screen

**Technical Requirements:**
- Implement `VoiceInput` component with Web Speech API
- Create `PlayEntry` component with keyboard fallback
- Add natural language parsing for voice input
- Implement play validation and error handling
- Create play history display component

**Definition of Done:**
- [ ] Voice input accurately captures play data
- [ ] Keyboard entry works as reliable fallback
- [ ] Play data is properly stored and retrievable
- [ ] Error handling prevents invalid data entry

**Dev Agent Record:**
- Agent Model Used: James (Developer)
- Debug Log References: 
- Completion Notes List:
- File List:
- Change Log:
- Status: Not Started

---

## Story 3.3: Intelligent Field Position and Down/Distance Calculation

**User Story:** As a user, I want the system to automatically calculate field position, down, and distance based on play results so that I don't have to manually track these complex calculations during fast-paced games.

**Acceptance Criteria:**
- [ ] Automatic down/distance calculation based on play results
- [ ] Field position tracking with yard line and side of field
- [ ] Intelligent inference of next play's starting position
- [ ] User override capability for edge cases
- [ ] Series end detection and new series management
- [ ] Field position display on main screen

**Technical Requirements:**
- Implement `GameEngine` service with calculation logic
- Create field position calculation utilities
- Add intelligent inference for next play position
- Implement series end detection algorithm
- Create field position display component

**Definition of Done:**
- [ ] Calculations are accurate for standard plays
- [ ] User overrides work correctly
- [ ] Series management functions properly
- [ ] Field position display is clear and accurate

**Dev Agent Record:**
- Agent Model Used: James (Developer)
- Debug Log References: 
- Completion Notes List:
- File List:
- Change Log:
- Status: Not Started 