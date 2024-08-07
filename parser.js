function parseData() {
    const textInput = document.getElementById('textInput').value;
    const fileInput = document.getElementById('fileInput').files[0];
    const output = document.getElementById('output');

    if (fileInput) {
        // If a file is selected, read the file
        const reader = new FileReader();
        reader.onload = function (event) {
            const data = parse(event.target.result);
            output.textContent = JSON.stringify(data, null, 2);
        };
        reader.readAsText(fileInput);
    } else if (textInput.trim() !== '') {
        // If text is pasted
        const data = parse(textInput);
        output.textContent = JSON.stringify(data, null, 2);
    } else {
        output.textContent = 'Please select a file or paste data into the textarea.';
    }
}

function parse(text) {
    const lines = text.split('\n');
    let entries = [];

    lines.forEach((line, index) => {
        let parts = line.split('\t');
        if (parts.length > 1 && parts[1].includes(':')) {
            // Entry for new schedule or time block
            if (entries.length > 0 && !entries[entries.length - 1].hasOwnProperty('courseInfo')) {
                // If the previous entry is only a time block without course info, pop it
                entries.pop();
            }
            entries.push({
                day: parts[0], time: parts[1], session: parts[2], courseInfo: {}
            });
        } else if (parts.length > 1) {
            // Additional course information is always after time block
            let lastEntry = entries[entries.length - 1];
            if (lastEntry && !lastEntry.courseInfo.hasOwnProperty('department')) {
                lastEntry.courseInfo = {
                    department: parts[0],
                    code: parts[1],
                    name: parts[2],
                    year: parts[3],
                    capacity: parts[4],
                    credits: parts[5],
                    room: parts[6].split(' - ')[1],  // Extract room detail after '-'
                    mode: parts[7]
                };
            } else {
                // If previous line was also course info, start new entry (if improperly formatted data)
                entries.push({
                    courseInfo: {
                        department: parts[0],
                        code: parts[1],
                        name: parts[2],
                        year: parts[3],
                        capacity: parts[4],
                        credits: parts[5],
                        room: parts[6].split(' - ')[1],
                        mode: parts[7]
                    }
                });
            }
        }
    });

    return entries;
}
