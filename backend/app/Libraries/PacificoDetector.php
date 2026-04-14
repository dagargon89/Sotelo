<?php

namespace App\Libraries;

use Config\Database;

class PacificoDetector
{
    /** @var array<int, string> */
    private array $keywords = [];

    public function __construct()
    {
        $db = Database::connect();
        $rows = $db->table('pacifico_keywords')
            ->select('keyword')
            ->where('is_active', 1)
            ->get()
            ->getResultArray();

        $this->keywords = array_map(static fn($row) => strtoupper(trim((string) $row['keyword'])), $rows);
    }

    public function isPacifico(string $loc): bool
    {
        $locUp = strtoupper(trim($loc));
        foreach ($this->keywords as $kw) {
            if ($kw !== '' && strpos($locUp, $kw) !== false) {
                return true;
            }
        }

        return false;
    }
}
