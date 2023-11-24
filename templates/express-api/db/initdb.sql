DO $$DECLARE BEGIN CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
IF NOT EXISTS (
  SELECT 1
  FROM information_schema.tables
  WHERE table_name = 'tasks'
) THEN RAISE INFO 'Creating table tasks';
EXECUTE 'CREATE TABLE tasks (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY, 
        title varchar(100),
        description text,
        completed boolean DEFAULT FALSE,
        created_date TIMESTAMPTZ DEFAULT now(),
        last_update_date TIMESTAMPTZ DEFAULT null
      );';
ELSE RAISE INFO 'TABLE tasks already exists';
END IF;
IF NOT EXISTS (
  SELECT 1
  FROM information_schema.tables
  WHERE table_name = 'task_lists'
) THEN RAISE INFO 'Creating table task_lists';
EXECUTE 'CREATE TABLE task_lists (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY, 
        title varchar(100),
        description text,
        completed boolean DEFAULT FALSE ,
        created_date TIMESTAMPTZ DEFAULT now(),
        last_update_date TIMESTAMPTZ DEFAULT null  
      );';
ELSE RAISE INFO 'TABLE task_lists already exists';
END IF;
IF NOT EXISTS (
  SELECT 1
  FROM information_schema.tables
  WHERE table_name = 'tasks_task_lists'
) THEN RAISE INFO 'Creating tasks_task_lists';
EXECUTE 'CREATE TABLE tasks_task_lists (
      tasks_id uuid REFERENCES tasks (id) ON DELETE CASCADE,
      task_list_id uuid REFERENCES task_lists (id) ON DELETE CASCADE,
      CONSTRAINT tasks_task_list_pkey PRIMARY KEY(tasks_id, task_list_id)
    );';
ELSE RAISE INFO 'TABLE tasks_task_lists already exists';
END IF;
END $$