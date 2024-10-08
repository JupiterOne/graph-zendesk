# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.3.1] - 2024-07-22

### Added

- Added filter for step `fetch-users` to filter on User Roles , example:
  end-user, admin, agent.

## [1.3.0] - 2024-05-02

### Added

- Updated integration to Node 18 and enabled ingest sources feature.

## [1.2.0] - 2022-09-07

### Added

- Optional flag OMIT_TICKET_DESCRIPTION allows ticket descriptions to be
  replaced with `<omitted>`.

## [1.1.1] - 2022-07-12

### Fixed

- Fixed pagination issue.

## [1.1.0] - 2022-01-28

### Added

- Added questions.yaml file for managed questions.
- Updated Account entity \_class and properties.

## [1.0.0] - 2021-11-24

### Added

- Initial implementation of Zendesk ingestion.
