import { type } from "os";

type PathList = Array<string>;

interface PathMapRecord {
  path: string;
  parentRecord: PathMapRecord;
  compont: object;
}

type PathMap = Record<string, PathMapRecord>;
