import { range } from 'lodash';
import { VersionValue } from '@nestjs/common/interfaces';
import { VERSION_NEUTRAL } from '@nestjs/common';
import { API_VERSION } from '../../constants/api';

/**
 * Utility function for assigning a range of API versions on which a controller is available'
 */
export function versions(minVersion: number, maxVersion?: number): string[] {
  return range(minVersion, (maxVersion || API_VERSION) + 1).map((v) =>
    v.toString(),
  );
}

export function defaultVersions(): string[] {
  return range(1, API_VERSION + 1)
    .reverse()
    .map((v) => v.toString());
}

export function testingVersions(): VersionValue {
  const versions = range(1, API_VERSION + 1).map((v) => v.toString());

  return [VERSION_NEUTRAL, ...versions];
}

export function getVersionFromUrl(url: string): string {
  return url.match(/(?<=\/|^)v\d+(?=\/)/)?.shift();
}
