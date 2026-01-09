# Quickstart Testing Guide: Frontend UI/UX Polish

**Feature**: 002-frontend-ui-polish
**Date**: 2026-01-08
**Purpose**: Manual testing scenarios to validate UI/UX polish implementation

## Overview

This document provides step-by-step testing scenarios to validate all UI/UX enhancements. Each scenario maps to user stories and functional requirements from the specification.

**Testing Environment**:
- Browser: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- Devices: Desktop (1920x1080), Tablet (768x1024), Mobile (375x667)
- Network: Fast 3G throttling for performance testing
- Accessibility: Keyboard only, screen reader (NVDA/VoiceOver)

---

## Testing Checklist

### Pre-Testing Setup

- [ ] Run `npm run build` to create production build
- [ ] Run `npm run dev` to start development server
- [ ] Open browser DevTools (F12)
- [ ] Enable Performance tab for animation testing
- [ ] Enable Accessibility inspector
- [ ] Clear browser cache and localStorage

---

## User Story 1: Visual Hierarchy & Spacing (P1)

**Goal**: Verify clean, well-organized interface with clear visual hierarchy

### Scenario 1.1: Task List Scanning

**Steps**:
1. Navigate to http://localhost:3000
2. Create 5 tasks with varying content lengths
3. Observe the task list layout

**Expected Results**:
- [ ] Task titles are visually prominent (larger font, bold weight)
- [ ] Task descriptions are clearly distinguishable from titles
- [ ] Metadata (priority, due date, tags) uses smaller, muted text
- [ ] Consistent spacing between elements (4px, 8px, 16px, 24px)
- [ ] No elements feel cramped or too far apart
- [ ] Visual rhythm makes scanning effortless

**Validation**:
- Measure spacing with DevTools (should match 4px base unit)
- Check font sizes: title (18-20px), description (14-16px), metadata (12-14px)

---

### Scenario 1.2: Task Card Visual Weight

**Steps**:
1. View a single task card
2. Identify the most important information at a glance

**Expected Results**:
- [ ] Task title is the most prominent element
- [ ] Status/priority badge is visually distinct
- [ ] Description is readable but secondary
- [ ] Actions (edit/delete) are subtle until hover
- [ ] Clear spacing between all elements

**Validation**:
- Title should be noticed first (largest, boldest)
- Priority badge should use semantic colors (red/amber/green)

---

### Scenario 1.3: Mobile Touch Targets

**Steps**:
1. Open DevTools and switch to mobile view (375x667)
2. Attempt to tap all interactive elements

**Expected Results**:
- [ ] All buttons are at least 44x44px
- [ ] Adequate spacing prevents mis-taps
- [ ] No overlapping touch targets
- [ ] Easy to tap checkboxes, edit, delete icons

**Validation**:
- Measure touch targets with DevTools (min 44x44px)
- Try tapping with finger on actual mobile device

---

## User Story 2: Smooth Animations & Transitions (P1)

**Goal**: Verify smooth, purposeful animations with appropriate timing

### Scenario 2.1: Task Creation Animation

**Steps**:
1. Click "Add Task" button
2. Fill in task details
3. Submit the form
4. Observe the new task appearing in the list

**Expected Results**:
- [ ] New task fades in smoothly (not instant pop-in)
- [ ] Task slides into position from bottom
- [ ] Animation duration feels natural (200-300ms)
- [ ] No jank or stuttering
- [ ] Surrounding tasks adjust smoothly

**Validation**:
- Record with Performance tab (should maintain 60fps)
- Animation should complete in <300ms
- Check for layout shifts (CLS should be minimal)

---

### Scenario 2.2: Task Completion Animation

**Steps**:
1. Click checkbox to mark task complete
2. Observe the completion animation

**Expected Results**:
- [ ] Checkbox animates smoothly (checkmark appears)
- [ ] Task text gets strikethrough animation
- [ ] Opacity reduces to indicate completed state
- [ ] Animation feels satisfying and provides clear feedback
- [ ] Duration is appropriate (150-200ms)

**Validation**:
- Animation should feel immediate but not jarring
- Strikethrough should animate from left to right

---

### Scenario 2.3: Task Deletion Animation

**Steps**:
1. Click delete icon on a task
2. Confirm deletion
3. Observe the task removal

**Expected Results**:
- [ ] Task fades out smoothly
- [ ] Task slides out to the right
- [ ] Surrounding tasks animate into new positions
- [ ] No sudden jumps or layout shifts
- [ ] Animation completes in <300ms

**Validation**:
- Record with Performance tab (60fps maintained)
- Check that other tasks don't jump instantly

---

### Scenario 2.4: Modal Open/Close Animation

**Steps**:
1. Click "Add Task" to open modal
2. Press Escape or click backdrop to close
3. Repeat several times

**Expected Results**:
- [ ] Modal scales in from 95% to 100%
- [ ] Backdrop fades in smoothly
- [ ] Modal slides up slightly from bottom
- [ ] Close animation is reverse of open
- [ ] No flash or instant appearance
- [ ] Duration feels natural (300ms open, 200ms close)

**Validation**:
- Modal should feel like it's "appearing" not "popping in"
- Backdrop should reach full opacity smoothly

---

### Scenario 2.5: Hover State Transitions

**Steps**:
1. Hover over various interactive elements (buttons, cards, inputs)
2. Move cursor in and out repeatedly

**Expected Results**:
- [ ] All hover states transition smoothly (not instant)
- [ ] Color changes are gradual (200ms)
- [ ] Shadow increases smoothly on cards
- [ ] No flickering or stuttering
- [ ] Transitions feel responsive but not sluggish

**Validation**:
- Hover should feel immediate but smooth
- No delay that makes interface feel slow

---

### Scenario 2.6: Dark Mode Transition

**Steps**:
1. Click dark mode toggle
2. Observe the theme change
3. Toggle back to light mode

**Expected Results**:
- [ ] Colors transition smoothly over 200-300ms
- [ ] No flash of wrong theme
- [ ] All elements transition together
- [ ] Icon animates (sun to moon rotation)
- [ ] Preference persists on page reload

**Validation**:
- No elements should change instantly
- Reload page - theme should be remembered

---

## User Story 3: Professional Color Palette & Typography (P1)

**Goal**: Verify cohesive, professional color scheme and typography

### Scenario 3.1: Light Mode Color Harmony

**Steps**:
1. Ensure light mode is active
2. View all UI elements (buttons, cards, badges, inputs)

**Expected Results**:
- [ ] Colors are harmonious and professional
- [ ] Primary color is used consistently for actions
- [ ] Neutral colors for backgrounds and borders
- [ ] Priority badges use semantic colors (red/amber/green)
- [ ] No jarring color combinations

**Validation**:
- Take screenshot and review color palette
- Check that colors feel cohesive, not random

---

### Scenario 3.2: Dark Mode Contrast

**Steps**:
1. Switch to dark mode
2. View all UI elements
3. Check text readability

**Expected Results**:
- [ ] All text meets WCAG AA contrast (4.5:1 minimum)
- [ ] Background is not pure black (easier on eyes)
- [ ] Colors maintain proper contrast ratios
- [ ] Priority colors are adjusted for dark mode (lighter)
- [ ] No pure white text on dark background

**Validation**:
- Use DevTools Accessibility inspector to check contrast ratios
- All text should pass WCAG AA (4.5:1 for normal text, 3:1 for large text)

---

### Scenario 3.3: Typography Hierarchy

**Steps**:
1. View task list with various content
2. Observe font sizes, weights, and line heights

**Expected Results**:
- [ ] Clear distinction between heading levels
- [ ] Task titles: 18-20px, bold/semibold
- [ ] Task descriptions: 14-16px, regular weight
- [ ] Metadata: 12-14px, muted color
- [ ] Line heights appropriate for readability (1.5 for body)
- [ ] Font weights create clear hierarchy

**Validation**:
- Measure font sizes with DevTools
- Check that hierarchy is immediately apparent

---

### Scenario 3.4: Priority Badge Colors

**Steps**:
1. Create tasks with high, medium, and low priorities
2. View priority badges in both light and dark modes

**Expected Results**:
- [ ] High priority: Red with sufficient contrast
- [ ] Medium priority: Amber/orange with sufficient contrast
- [ ] Low priority: Green with sufficient contrast
- [ ] Colors are semantically appropriate
- [ ] Badges are readable in both themes

**Validation**:
- Check contrast ratios with DevTools
- Colors should be intuitive (red = urgent, green = low priority)

---

## User Story 4: Micro-interactions & Feedback (P2)

**Goal**: Verify immediate, delightful feedback for all interactions

### Scenario 4.1: Button Press Animation

**Steps**:
1. Click various buttons (Add Task, Submit, Cancel)
2. Observe the press animation

**Expected Results**:
- [ ] Button scales down slightly on press (95%)
- [ ] Animation is immediate (150ms)
- [ ] Provides tactile feedback
- [ ] Returns to normal size on release
- [ ] Works on all button types

**Validation**:
- Press should feel responsive and satisfying
- Scale should be subtle (not dramatic)

---

### Scenario 4.2: Card Hover Elevation

**Steps**:
1. Hover over task cards
2. Observe shadow and interaction changes

**Expected Results**:
- [ ] Card shadow increases smoothly
- [ ] Edit/delete icons fade in on hover
- [ ] Elevation change is subtle but noticeable
- [ ] Transition is smooth (200ms)
- [ ] Cursor changes to pointer

**Validation**:
- Shadow should go from md to lg
- Icons should fade in, not pop in

---

### Scenario 4.3: Form Field Focus States

**Steps**:
1. Open task creation modal
2. Tab through all form fields
3. Observe focus states

**Expected Results**:
- [ ] Border color transitions to primary color
- [ ] Focus ring appears (2px, primary color with 20% opacity)
- [ ] Transition is smooth (150ms)
- [ ] Focus indicator is clearly visible
- [ ] Label animates if present

**Validation**:
- Focus ring should be visible on all backgrounds
- Transition should feel immediate but smooth

---

### Scenario 4.4: Tag Add/Remove Animation

**Steps**:
1. Open task form
2. Add several tags
3. Remove tags one by one

**Expected Results**:
- [ ] New tags scale in with fade (200ms)
- [ ] Removed tags scale out with fade (200ms)
- [ ] Animations are smooth and satisfying
- [ ] No layout shift when adding/removing
- [ ] Input field adjusts smoothly

**Validation**:
- Tags should appear/disappear gracefully
- No sudden jumps in layout

---

### Scenario 4.5: Dark Mode Toggle Animation

**Steps**:
1. Click dark mode toggle
2. Observe icon transition

**Expected Results**:
- [ ] Icon rotates smoothly (sun to moon or vice versa)
- [ ] Rotation is 180 degrees
- [ ] Duration matches theme transition (200-300ms)
- [ ] No flickering or stuttering

**Validation**:
- Icon should rotate, not just swap instantly
- Rotation should feel natural

---

### Scenario 4.6: Toast Notification Animation

**Steps**:
1. Perform actions that trigger toasts (create, update, delete tasks)
2. Observe toast entrance and exit

**Expected Results**:
- [ ] Toast slides in from right with fade
- [ ] Entrance is smooth (200ms)
- [ ] Toast auto-dismisses after 3-4 seconds
- [ ] Exit animation slides out to right with fade
- [ ] Multiple toasts stack properly

**Validation**:
- Toast should feel attention-grabbing but not jarring
- Exit should be smooth, not abrupt

---

## User Story 5: Enhanced Empty States (P2)

**Goal**: Verify friendly, helpful empty states with clear guidance

### Scenario 5.1: Initial Empty State

**Steps**:
1. Clear all tasks (or use fresh installation)
2. View the empty state

**Expected Results**:
- [ ] Large icon or illustration is displayed (not just text)
- [ ] Icon is subtle (low opacity, muted color)
- [ ] Encouraging message: "Ready to get organized?"
- [ ] Clear call-to-action: "Create your first task"
- [ ] CTA button is prominently displayed
- [ ] Empty state feels intentional, not broken

**Validation**:
- Empty state should feel inviting, not empty
- CTA should be obvious and clickable

---

### Scenario 5.2: Filtered Empty State

**Steps**:
1. Create some tasks
2. Apply a filter that returns no results (e.g., filter by "Completed" when no tasks are complete)
3. View the empty state

**Expected Results**:
- [ ] Contextual message explains the filter
- [ ] Message suggests how to clear filter or adjust criteria
- [ ] Different from initial empty state
- [ ] Clear button to reset filter

**Validation**:
- User should understand why list is empty
- Should be easy to get back to full list

---

## User Story 6: Polished Form Design (P2)

**Goal**: Verify modern forms with clear feedback and validation

### Scenario 6.1: Form Field Focus States

**Steps**:
1. Open task creation modal
2. Click into each form field
3. Observe focus states

**Expected Results**:
- [ ] Border transitions to primary color
- [ ] Subtle shadow appears (focus ring)
- [ ] Transition is smooth (150ms)
- [ ] Focus indicator is clearly visible
- [ ] Placeholder text behavior is appropriate

**Validation**:
- Focus should be immediately obvious
- No confusion about which field is active

---

### Scenario 6.2: Validation Error States

**Steps**:
1. Open task creation modal
2. Try to submit with empty title
3. Observe validation error

**Expected Results**:
- [ ] Error message appears with smooth animation
- [ ] Error message is clear and helpful
- [ ] Field border turns red
- [ ] Error icon appears
- [ ] Focus returns to invalid field

**Validation**:
- Error should be obvious but not aggressive
- Message should help user fix the issue

---

### Scenario 6.3: Required Field Indicators

**Steps**:
1. Open task creation modal
2. Identify required fields

**Expected Results**:
- [ ] Required fields are clearly marked (asterisk or label)
- [ ] Marking is not overwhelming
- [ ] Consistent across all forms
- [ ] Accessible (announced by screen reader)

**Validation**:
- User should know which fields are required
- Marking should be subtle but clear

---

### Scenario 6.4: Character Counter

**Steps**:
1. Open task creation modal
2. Type in description field (if character limit exists)
3. Observe character counter

**Expected Results**:
- [ ] Counter appears when approaching limit
- [ ] Counter shows remaining characters
- [ ] Counter turns red when limit exceeded
- [ ] Smooth appearance animation

**Validation**:
- Counter should help user stay within limits
- Should not be distracting when plenty of space remains

---

### Scenario 6.5: Tag Input Interaction

**Steps**:
1. Open task creation modal
2. Add tags using Enter key and comma
3. Remove tags using Backspace and X button

**Expected Results**:
- [ ] Tags add on Enter or comma
- [ ] Tags animate in smoothly
- [ ] Backspace removes last tag
- [ ] X button removes specific tag
- [ ] Clear visual feedback for all actions
- [ ] Duplicate tags prevented

**Validation**:
- Tag input should feel intuitive
- All keyboard shortcuts should work

---

### Scenario 6.6: Form Submit Loading State

**Steps**:
1. Open task creation modal
2. Fill in form
3. Submit and observe loading state

**Expected Results**:
- [ ] Submit button shows loading spinner
- [ ] Button is disabled during submission
- [ ] Loading state is visually distinct
- [ ] Form fields are disabled during submission
- [ ] No double-submission possible

**Validation**:
- User should know form is processing
- Should not be able to submit twice

---

## User Story 7: Improved Loading States (P3)

**Goal**: Verify skeleton screens and progressive loading

### Scenario 7.1: Initial Page Load

**Steps**:
1. Clear browser cache
2. Navigate to http://localhost:3000
3. Observe loading state

**Expected Results**:
- [ ] Skeleton cards appear immediately
- [ ] Skeletons match final layout (same size, position)
- [ ] Shimmer animation indicates loading
- [ ] No layout shift when real content loads
- [ ] Content fades in smoothly

**Validation**:
- Skeleton should look like placeholder for real content
- No jumping or shifting when content loads

---

### Scenario 7.2: Skeleton Shimmer Animation

**Steps**:
1. Observe skeleton screens during loading
2. Check shimmer effect

**Expected Results**:
- [ ] Subtle shimmer effect moves across skeleton
- [ ] Shimmer indicates loading, not static
- [ ] Animation is smooth and continuous
- [ ] Not distracting or too bright

**Validation**:
- Shimmer should be subtle but noticeable
- Should clearly indicate "loading" state

---

### Scenario 7.3: Optimistic Update Feedback

**Steps**:
1. Create a task
2. Observe immediate UI update
3. Wait for API confirmation

**Expected Results**:
- [ ] Task appears immediately (optimistic update)
- [ ] Loading indicator shows API is processing
- [ ] Success toast appears on confirmation
- [ ] If API fails, task is removed with error toast
- [ ] Feedback appears within 100ms

**Validation**:
- UI should feel instant, not waiting for server
- User should know when action is confirmed

---

### Scenario 7.4: Content Fade-In

**Steps**:
1. Reload page
2. Observe content appearing after loading

**Expected Results**:
- [ ] Content fades in smoothly (not instant pop-in)
- [ ] Fade duration is appropriate (200ms)
- [ ] No layout shift during fade
- [ ] All content fades together

**Validation**:
- Content should appear gracefully
- No jarring instant appearance

---

## User Story 8: Responsive Design Refinements (P3)

**Goal**: Verify mobile-optimized layout and interactions

### Scenario 8.1: Mobile Layout

**Steps**:
1. Open DevTools and switch to mobile view (375x667)
2. View task list

**Expected Results**:
- [ ] Single column layout
- [ ] Cards use full width with appropriate padding
- [ ] Touch targets are large enough (44x44px minimum)
- [ ] No horizontal scrolling
- [ ] Content is readable without zooming

**Validation**:
- Measure touch targets (min 44x44px)
- Try on actual mobile device

---

### Scenario 8.2: Mobile Modal Behavior

**Steps**:
1. Switch to mobile view
2. Open task creation modal

**Expected Results**:
- [ ] Modal slides up from bottom (not centered)
- [ ] Modal is full-width or near full-width
- [ ] Easy to reach close button with thumb
- [ ] Keyboard doesn't obscure form fields
- [ ] Form scrolls appropriately

**Validation**:
- Modal should be thumb-friendly
- All form fields should be accessible

---

### Scenario 8.3: Mobile Form Field Focus

**Steps**:
1. Switch to mobile view
2. Tap into form fields

**Expected Results**:
- [ ] Keyboard appears without obscuring field
- [ ] Page scrolls to keep field visible
- [ ] Focus state is clearly visible
- [ ] Easy to move between fields

**Validation**:
- User should always see the field they're typing in
- No frustration with hidden fields

---

### Scenario 8.4: Swipe Actions (if implemented)

**Steps**:
1. Switch to mobile view
2. Swipe left/right on task cards

**Expected Results**:
- [ ] Swipe reveals quick actions (edit/delete)
- [ ] Swipe animation is smooth
- [ ] Actions are easy to tap
- [ ] Swipe back to hide actions

**Validation**:
- Swipe should feel natural on mobile
- Actions should be discoverable

---

## Accessibility Testing

### Scenario A11y-1: Keyboard Navigation

**Steps**:
1. Disconnect mouse
2. Navigate entire app using only keyboard

**Expected Results**:
- [ ] Tab moves through all interactive elements
- [ ] Focus order is logical (top to bottom, left to right)
- [ ] Enter activates buttons and links
- [ ] Escape closes modals
- [ ] Arrow keys work where appropriate
- [ ] No keyboard traps

**Validation**:
- Should be able to complete all tasks with keyboard only
- Focus should always be visible

---

### Scenario A11y-2: Screen Reader Testing

**Steps**:
1. Enable screen reader (NVDA on Windows, VoiceOver on Mac)
2. Navigate through the app

**Expected Results**:
- [ ] All content is announced correctly
- [ ] Interactive elements have clear labels
- [ ] Form fields have associated labels
- [ ] Error messages are announced
- [ ] Loading states are announced
- [ ] Dynamic content updates are announced

**Validation**:
- Screen reader user should understand all content
- No confusion about what elements do

---

### Scenario A11y-3: Color Contrast

**Steps**:
1. Use DevTools Accessibility inspector
2. Check contrast ratios for all text

**Expected Results**:
- [ ] All normal text meets 4.5:1 contrast ratio
- [ ] All large text meets 3:1 contrast ratio
- [ ] All UI components meet 3:1 contrast ratio
- [ ] Passes in both light and dark modes

**Validation**:
- Use DevTools to measure contrast ratios
- All text should pass WCAG AA

---

### Scenario A11y-4: Reduced Motion

**Steps**:
1. Enable "Reduce motion" in OS settings
2. Reload the app
3. Perform various actions

**Expected Results**:
- [ ] Animations are disabled or significantly reduced
- [ ] Functionality still works without animations
- [ ] No jarring instant changes
- [ ] Transitions are instant but not broken

**Validation**:
- App should respect user preference
- Should still be usable without animations

---

## Performance Testing

### Scenario Perf-1: Animation Frame Rate

**Steps**:
1. Open DevTools Performance tab
2. Start recording
3. Perform actions with animations (create task, open modal, etc.)
4. Stop recording and analyze

**Expected Results**:
- [ ] All animations maintain 60fps (16.67ms per frame)
- [ ] No dropped frames
- [ ] No long tasks blocking main thread
- [ ] No layout thrashing

**Validation**:
- Check Performance tab for frame rate
- Green bars should be consistent, no red spikes

---

### Scenario Perf-2: Bundle Size Impact

**Steps**:
1. Run `npm run build` before and after implementation
2. Compare bundle sizes

**Expected Results**:
- [ ] Bundle size increase is <500KB
- [ ] Main page bundle is reasonable (<200KB)
- [ ] No unnecessary dependencies added

**Validation**:
- Check build output for bundle sizes
- Compare with baseline from 001-nextjs-todo-frontend

---

### Scenario Perf-3: Lighthouse Audit

**Steps**:
1. Run `npx lighthouse http://localhost:3000 --view`
2. Review all scores

**Expected Results**:
- [ ] Performance score ≥90
- [ ] Accessibility score ≥90
- [ ] Best Practices score ≥90
- [ ] SEO score ≥90
- [ ] FCP <1.5s
- [ ] LCP <2.5s
- [ ] CLS <0.1

**Validation**:
- All scores should meet or exceed targets
- No regressions from baseline

---

### Scenario Perf-4: Throttled Network

**Steps**:
1. Enable Fast 3G throttling in DevTools
2. Reload the app
3. Perform various actions

**Expected Results**:
- [ ] Loading states appear immediately
- [ ] Skeleton screens show while loading
- [ ] Optimistic updates still feel instant
- [ ] No long waits without feedback
- [ ] Graceful degradation

**Validation**:
- App should feel responsive even on slow network
- User should always know what's happening

---

## Edge Cases

### Scenario Edge-1: Very Long Task Titles

**Steps**:
1. Create a task with a very long title (200+ characters)
2. Observe how it's displayed

**Expected Results**:
- [ ] Title truncates with ellipsis
- [ ] Tooltip shows full title on hover
- [ ] No layout breaking
- [ ] Card maintains proper size

**Validation**:
- Long content should not break layout
- Full content should be accessible

---

### Scenario Edge-2: Many Tasks (100+)

**Steps**:
1. Create 100+ tasks
2. Scroll through the list
3. Perform actions

**Expected Results**:
- [ ] Scrolling is smooth (60fps)
- [ ] Animations still perform well
- [ ] No memory leaks
- [ ] Virtual scrolling if implemented

**Validation**:
- Performance should not degrade with many items
- Check DevTools Memory tab for leaks

---

### Scenario Edge-3: Rapid Actions

**Steps**:
1. Rapidly create, update, and delete tasks
2. Click buttons multiple times quickly

**Expected Results**:
- [ ] No double-submissions
- [ ] Animations don't conflict
- [ ] Debouncing prevents issues
- [ ] UI remains stable

**Validation**:
- App should handle rapid input gracefully
- No crashes or broken states

---

### Scenario Edge-4: Dark Mode with Images

**Steps**:
1. Add tasks with various content
2. Switch between light and dark modes

**Expected Results**:
- [ ] All content remains readable
- [ ] Images have appropriate overlays if needed
- [ ] No pure white backgrounds in dark mode
- [ ] Smooth transition for all elements

**Validation**:
- Content should be readable in both themes
- No jarring contrasts

---

## Regression Testing

### Scenario Reg-1: Existing Functionality

**Steps**:
1. Test all existing features from 001-nextjs-todo-frontend
2. Verify nothing is broken

**Expected Results**:
- [ ] All CRUD operations still work
- [ ] Filtering still works
- [ ] Status changes still work
- [ ] Tags still work
- [ ] Dark mode still works
- [ ] Optimistic updates still work

**Validation**:
- No regressions from previous implementation
- All existing features intact

---

## Summary Checklist

### Must Pass (Blocking Issues)
- [ ] All animations maintain 60fps
- [ ] All text meets WCAG AA contrast ratios
- [ ] Keyboard navigation works completely
- [ ] No layout shifts (CLS <0.1)
- [ ] Bundle size increase <500KB
- [ ] Lighthouse scores ≥90

### Should Pass (High Priority)
- [ ] All animations complete within 300ms
- [ ] Reduced motion is respected
- [ ] Screen reader announces all content
- [ ] Mobile touch targets ≥44x44px
- [ ] Empty states are helpful
- [ ] Loading states appear within 100ms

### Nice to Have (Medium Priority)
- [ ] Swipe actions on mobile
- [ ] Advanced micro-interactions
- [ ] Skeleton shimmer animation
- [ ] Character counters on inputs

---

## Reporting Issues

When reporting issues, include:
1. **Scenario**: Which test scenario failed
2. **Steps**: Exact steps to reproduce
3. **Expected**: What should happen
4. **Actual**: What actually happened
5. **Browser**: Browser and version
6. **Device**: Desktop/tablet/mobile
7. **Screenshot**: Visual evidence if applicable
8. **Console**: Any errors in DevTools console

---

## Next Steps After Testing

1. Document all issues found
2. Prioritize issues (blocking, high, medium, low)
3. Create tasks for fixes in tasks.md
4. Re-test after fixes
5. Run automated tests (Jest + RTL + jest-axe)
6. Final Lighthouse audit
7. Sign-off from stakeholders
