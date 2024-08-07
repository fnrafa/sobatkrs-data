<?php
$servername = "your_server";
$username = "your_username";
$password = "your_password";
$dbname = "your_database";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$data = json_decode(file_get_contents('php://input'), true);

$department = $data['courseInfo']['department'];
$code = $data['courseInfo']['code'];
$name = $data['courseInfo']['name'];
$year = $data['courseInfo']['year'];
$capacity = $data['courseInfo']['capacity'];
$credits = $data['courseInfo']['credits'];
$room = $data['courseInfo']['room'];
$mode = $data['courseInfo']['mode'];
$day = $data['day'];
$time = $data['time'];
list($jam_mulai, $jam_selesai) = explode(' - ', $time);

// Check if matkul exists
$sql = "SELECT id FROM matkuls WHERE kode = '$code'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $matkulId = $row['id'];
} else {
    $sql = "INSERT INTO matkuls (kode, nama, tahun_kurikulum, sks, created_at, updated_at) VALUES ('$code', '$name', '$year', '$credits', NOW(), NOW())";
    if ($conn->query($sql) === TRUE) {
        $matkulId = $conn->insert_id;
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
        exit();
    }
}

$kelasName = "$department $name";
$sql = "SELECT id FROM kelas WHERE nama = '$kelasName'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $kelasId = $row['id'];
} else {
    $sql = "INSERT INTO kelas (kode_matkul, nama, created_at, updated_at) VALUES ('$code', '$kelasName', NOW(), NOW())";
    if ($conn->query($sql) === TRUE) {
        $kelasId = $conn->insert_id;
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
        exit();
    }
}

$sql = "INSERT INTO jadwal_kelas (id_kelas, hari, jam_mulai, jam_selesai, ruang_kelas) VALUES ('$kelasId', '$day', '$jam_mulai', '$jam_selesai', '$room')";
if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();