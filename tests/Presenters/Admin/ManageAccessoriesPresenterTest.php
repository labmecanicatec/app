<?php

declare(strict_types=1);

require_once(ROOT_DIR . 'Pages/Admin/ManageAccessoriesPage.php');

class ManageAccessoriesPresenterTest extends TestBase
{
    /**
     * @var IManageAccessoriesPage|PHPUnit\Framework\MockObject\MockObject
     */
    private $page;

    /**
     * @var IResourceRepository|PHPUnit\Framework\MockObject\MockObject
     */
    public $resourceRepository;

    /**
     * @var IAccessoryRepository|PHPUnit\Framework\MockObject\MockObject
     */
    public $accessoryRepository;

    /**
     * @var ManageAccessoriesPresenter
     */
    private $presenter;

    public function setUp(): void
    {
        parent::setup();

        $this->page = $this->createMock('IManageAccessoriesPage');
        $this->resourceRepository = $this->createMock('IResourceRepository');
        $this->accessoryRepository = $this->createMock('IAccessoryRepository');

        $this->presenter = new ManageAccessoriesPresenter(
            $this->page,
            $this->resourceRepository,
            $this->accessoryRepository
        );
    }

    public function teardown(): void
    {
        parent::teardown();
    }

    public function testWhenInitializing()
    {
        $accessories = [];
        $resources = [];

        $this->resourceRepository->expects($this->once())
            ->method('GetAccessoryList')
            ->willReturn($accessories);

        $this->resourceRepository->expects($this->once())
            ->method('GetResourceList')
            ->willReturn($resources);

        $this->page->expects($this->once())
            ->method('BindAccessories')
            ->with($this->equalTo($accessories));

        $this->page->expects($this->once())
            ->method('BindResources')
            ->with($this->equalTo($resources));

        $this->presenter->PageLoad();
    }

    public function testWhenInitializingIncludesAssociatedResourceNames()
    {
        $accessories = [
            AccessoryDto::Create([
                ColumnNames::ACCESSORY_ID => 1,
                ColumnNames::ACCESSORY_NAME => 'Projector',
                ColumnNames::ACCESSORY_QUANTITY => 2,
                ColumnNames::ACCESSORY_RESOURCE_COUNT => 2,
                ColumnNames::RESOURCE_ACCESSORY_LIST => '10,1,2!sep!20,1,2',
            ]),
        ];

        $resourceOne = $this->createMock('IResource');
        $resourceOne->method('GetId')->willReturn(10);
        $resourceOne->method('GetName')->willReturn('Room A');
        $resourceTwo = $this->createMock('IResource');
        $resourceTwo->method('GetId')->willReturn(20);
        $resourceTwo->method('GetName')->willReturn('Room B');
        $resources = [$resourceOne, $resourceTwo];

        $this->resourceRepository->method('GetAccessoryList')->willReturn($accessories);
        $this->resourceRepository->method('GetResourceList')->willReturn($resources);

        $this->presenter->PageLoad();

        $this->assertSame('Room A, Room B', $accessories[0]->AssociatedResourceNames);
    }

    public function testWhenAdding()
    {
        $name = 'accessory';
        $quantity = 2;

        $expectedAccessory = Accessory::Create($name, $quantity);

        $this->page->expects($this->once())
                ->method('GetAccessoryName')
                ->willReturn($name);

        $this->page->expects($this->once())
                ->method('GetQuantityAvailable')
                ->willReturn($quantity);

        $this->accessoryRepository->expects($this->once())
            ->method('Add')
            ->with($this->equalTo($expectedAccessory));

        $this->presenter->AddAccessory();
    }

    public function testWhenEditing()
    {
        $id = 1982;
        $name = 'accessory';
        $quantity = 2;

        $currentAccessory = new Accessory($id, 'lskdjfl', 18181);
        $expectedAccessory = new Accessory($id, $name, $quantity);

        $this->page->expects($this->once())
                ->method('GetAccessoryId')
                ->willReturn($id);

        $this->page->expects($this->once())
                ->method('GetAccessoryName')
                ->willReturn($name);

        $this->page->expects($this->once())
                ->method('GetQuantityAvailable')
                ->willReturn($quantity);

        $this->accessoryRepository->expects($this->once())
            ->method('LoadById')
            ->with($this->equalTo($id))
            ->willReturn($currentAccessory);

        $this->accessoryRepository->expects($this->once())
            ->method('Update')
            ->with($this->equalTo($expectedAccessory));

        $this->presenter->ChangeAccessory();
    }

    public function testWhenDeleting()
    {
        $id = 1982;

        $this->page->expects($this->once())
                ->method('GetAccessoryId')
                ->willReturn($id);

        $this->accessoryRepository->expects($this->once())
            ->method('Delete')
            ->with($this->equalTo($id));

        $this->presenter->DeleteAccessory();
    }

    public function testEditingUnknownAccessoryChangesNothing(): void
    {
        $this->page->method('GetAccessoryId')->willReturn(999);
        $this->page->method('GetAccessoryName')->willReturn('name');
        $this->page->method('GetQuantityAvailable')->willReturn(1);
        $this->accessoryRepository->method('LoadById')->willReturn(null);
        $this->accessoryRepository->expects($this->never())->method('Update');

        $this->presenter->ChangeAccessory();
    }

    public function testLoadingResourcesOfUnknownAccessoryBindsNoResources(): void
    {
        $this->page->method('GetAccessoryId')->willReturn(999);
        $this->accessoryRepository->method('LoadById')->willReturn(null);
        $this->page->expects($this->once())
            ->method('SetAccessoryResources')
            ->with($this->equalTo([]));

        $this->presenter->ProcessDataRequest('accessoryResources');
    }

    public function testChangingResourcesOfUnknownAccessoryChangesNothing(): void
    {
        $this->page->method('GetAccessoryId')->willReturn(999);
        $this->page->method('GetAccessoryResources')->willReturn([]);
        $this->page->method('GetAccessoryResourcesMinimums')->willReturn([]);
        $this->page->method('GetAccessoryResourcesMaximums')->willReturn([]);
        $this->accessoryRepository->method('LoadById')->willReturn(null);
        $this->accessoryRepository->expects($this->never())->method('Update');

        $this->presenter->ChangeAccessoryResources();
    }
}
