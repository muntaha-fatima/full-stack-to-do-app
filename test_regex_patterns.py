import re

# Define the patterns from the TodoAgent
complete_task_patterns = [
    r"(?:complete|finish|mark|done)\s+(?:task\s+|#|no\.?\s*)?(\d+)",
    r"(?:task\s+|#|no\.?\s*)(\d+)\s+(?:is\s+)?(?:complete|finished|done)"
]

delete_task_patterns = [
    r"(?:delete|remove|cancel|eliminate)\s+(?:task\s+|#|no\.?\s*)?(\d+)"
]

update_task_patterns = [
    r"(?:update|change|modify|edit)\s+(?:task\s+|#|no\.?\s*)(\d+)(?:\s+(?:to|with|as):\s*(.+)|\s*:\s*(.+))",
    r"(?:task\s+|#|no\.?\s*)(\d+)\s+(?:update|change|modify|edit)\s+(?:to|with|as):\s*(.+)"
]

def test_patterns(patterns, test_messages, pattern_name):
    print(f"\nTesting {pattern_name}:")
    for message in test_messages:
        print(f"Message: '{message}'")
        for i, pattern in enumerate(patterns):
            match = re.search(pattern, message.lower(), re.IGNORECASE)
            if match:
                print(f"  OK Pattern {i+1} matched: {match.groups()}")
                break
        else:
            print(f"  NO MATCH No pattern matched")

# Test messages
complete_messages = [
    "Complete task 5",
    "Finish task 5",
    "Mark task 5 complete",
    "Task 5 is done",
    "Complete #5",
    "Finish no. 5"
]

delete_messages = [
    "Delete task 3",
    "Remove task 3",
    "Cancel task 3",
    "Delete #3",
    "Remove no. 3"
]

update_messages = [
    "Update task 2: Call mom tomorrow",
    "Change task 2 to: Call mom tomorrow",
    "Edit task 2: Call mom tomorrow",
    "Update #2: Call mom tomorrow",
    "Task 2 update to: Call mom tomorrow"
]

# Run tests
test_patterns(complete_task_patterns, complete_messages, "Complete Task Patterns")
test_patterns(delete_task_patterns, delete_messages, "Delete Task Patterns")
test_patterns(update_task_patterns, update_messages, "Update Task Patterns")