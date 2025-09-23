#pragma once
#include <iostream>


template <typename T>
class TArray
{
public:
	TArray()
	{
		InternalArray = new T[MaxLength];
	};
	TArray(T InitValue, int InitLength)
	{
		Length = InitLength;
		while (InitLength > MaxLength)
		{
			MaxLength *= 2;
		}
		InternalArray = new T[MaxLength];
		for (int InitIndex = 0; InitIndex < InitLength; ++InitIndex)
		{
			InternalArray[InitIndex] = InitValue;
		}
	}
	TArray(int InitLength)
	{
		Length = InitLength;
		while (InitLength > MaxLength)
		{
			MaxLength *= 2;
		}
		InternalArray = new T[MaxLength];
		/*for (int InitIndex = 0; InitIndex < InitLength; ++InitIndex)
		{
			InternalArray[InitIndex] = 0;
		}*/
	}
	TArray(const TArray& Other)
	{
		// Copy another TArray
		MaxLength = Other.MaxLength;
		Length = Other.Length;
		InternalArray = new T[MaxLength];
		for (int i = 0; i < Length; ++i)
		{
			InternalArray[i] = Other.InternalArray[i];
		}
	}
	~TArray()
	{
		delete[] InternalArray;
	};

	TArray& operator=(const TArray& Other)
	{
		// Assigning Other to this Array
		// If this and Other are different
		if (this != &Other)
		{
			// Practically the same as the copy constructor, expect we delete this before reassigning
			delete[] InternalArray;
			MaxLength = Other.MaxLength;
			Length = Other.Length;
			InternalArray = new T[MaxLength];
			for (int i = 0; i < Length; ++i)
			{
				InternalArray[i] = Other.InternalArray[i];
			}
		}
		return *this;
	}

	virtual void AddElement(const T& NewElement)
	{
		// If the array is full, double the size
		if (Length == MaxLength)
		{
			MaxLength *= 2;
			T* NewArray = new T[MaxLength];
			//std::memcpy(NewArray, InternalArray, sizeof(T) * Length); // Memcpy was bad because of AnimatedSprites SharedPtr literally got copied and didnt update references
			for (int i = 0; i < Length; ++i)
			{
				NewArray[i] = std::move(InternalArray[i]);
			}
			delete[] InternalArray;
			InternalArray = NewArray;
		}
		// Add the new element
		InternalArray[Length] = NewElement;
		++Length;
	}

	virtual T& GetElement(int Index)
	{
		return InternalArray[Index];
	}

	virtual void RemoveElement(const int Index)
	{
		// Check if Index is real
		if (Index >= Length)
		{
			return;
		}
		// We dont really delete anything, we just shift the whole array left on top of Index
		for (int CurrIndex = Index; CurrIndex < Length - 1; ++CurrIndex)
		{
			InternalArray[CurrIndex] = InternalArray[CurrIndex + 1];
		}
		--Length;
	}

	virtual void RemoveElementMatching(const T& ElementToRemove)
	{
		for (int Index = 0; Index < Num(); ++Index)
		{
			if (ElementToRemove == GetElement(Index))
			{
				RemoveElement(Index);
				return;
			}
		}
	}

	virtual bool Contains(const T& Element) const
	{
		for (int CurrIndex = 0; CurrIndex < Length; ++CurrIndex)
		{
			if (Element == InternalArray[CurrIndex])
			{
				return true;
			}
		}
		return false;
	}

	bool IsValidIndex(const int Index) const
	{
		return Index < Length;
	}

	bool IsEmpty() const
	{
		return !Length;
	}

	int Num() const
	{
		return Length;
	}

private:
	int MaxLength = 5;
	int Length = 0;
	T* InternalArray = nullptr;
};



template <typename T>
class TDictionary
{
public:
	TDictionary()
	{
	}
	
	virtual void AddElement(const std::string NewKey, const T& NewElement)
	{
		// Check if key already in dictionary
		for (int ArrayIndex = 0; ArrayIndex < InternalDictionary.Num(); ++ArrayIndex)
		{
			if (InternalDictionary.GetElement(ArrayIndex).Key == NewKey)
			{
				std::cout << "ERROR: Tried to add Dictionary Key '" << NewKey << "', But it's already been added.\n";
			}
		}
		// Add the element
		KeyPair NewPair = { .Key = NewKey, .Value = NewElement };
		InternalDictionary.AddElement(NewPair);
	}

	virtual T& GetElement(const std::string InKey)
	{
		for (int ArrayIndex = 0; ArrayIndex < InternalDictionary.Num(); ++ArrayIndex)
		{
			if (InternalDictionary.GetElement(ArrayIndex).Key == InKey)
			{
				return InternalDictionary.GetElement(ArrayIndex).Value;
			}
		}
		std::cout << "Couldn't find Key '" << InKey << "' in TDictionary\n";
	}

	virtual void RemoveElement(const std::string InKey)
	{
		for (int ArrayIndex = 0; ArrayIndex < InternalDictionary.Num(); ++ArrayIndex)
		{
			if (InternalDictionary.GetElement(ArrayIndex).Key == InKey)
			{
				InternalDictionary.RemoveElement(ArrayIndex);
				return;
			}
		}
	}

	// Below two functions are not working and i do not have time to figure out their shenanigans
	/*virtual void RemoveElementMatching(T& ElementToRemove)
	{
		for (int ArrayIndex = 0; ArrayIndex < InternalDictionary.Num(); ++ArrayIndex)
		{
			if (InternalDictionary.GetElement(ArrayIndex).Value == ElementToRemove)
			{
				InternalDictionary.RemoveElement(ArrayIndex);
				return;
			}
		}
	}*/

	/*virtual bool Contains(const T& Value) const
	{
		for (int ArrayIndex = 0; ArrayIndex < InternalDictionary.Num(); ++ArrayIndex)
		{
			if (InternalDictionary.GetElement(ArrayIndex).Value == Value)
			{
				return true;
			}
		}
		return false;
	}*/

	bool IsValidKey(const std::string InKey) const
	{
		for (int ArrayIndex = 0; ArrayIndex < InternalDictionary.Num(); ++ArrayIndex)
		{
			if (InternalDictionary.GetElement(ArrayIndex).Key == InKey)
			{
				return true;
			}
		}
		return false;
	}

	bool IsEmpty() const
	{
		return !InternalDictionary.Num();
	}

	int Num() const
	{
		return InternalDictionary.Num();
	}
private:
	struct KeyPair
	{
		std::string Key;
		T Value;

		bool operator==(const KeyPair& OtherKeyPair)
		{
			return Key == OtherKeyPair.Key;
		}
	};

	TArray<KeyPair> InternalDictionary = TArray<KeyPair>();
};



template <typename T>
class TLinkedList : public TArray<T>
{
public:
	TLinkedList()
	{
	}
	~TLinkedList()
	{
		Node* CurrNode = Head;
		while (CurrNode)
		{
			Node* NodeToDelete = CurrNode;
			CurrNode = CurrNode->NextNode;
			delete NodeToDelete;
		}
	}


	virtual void AddElement(T& NewElement) override
	{
		Node* NewNode = new Node{ NewElement, nullptr };
		this->IsEmpty() ? Head = NewNode : Tail->NextNode = NewNode;
		Tail = NewNode;
		++Length;
	}

	virtual T& GetElement(int Index) const override
	{
		// Iterate through
		Node* CurrNode = Head;
		for (int NodeIndex = 0; NodeIndex < Index; ++NodeIndex)
		{
			CurrNode = CurrNode->NextNode;
		}
		return CurrNode->Item;
	}

	virtual void RemoveElement(int Index) override
	{
		// If the Index isn't valid, we aint doing anything
		if (!this->IsValidIndex(Index))
		{
			return;
		}
		// If the Index is the head, delete it and make next node the head
		if (Index == 0)
		{
			Node* NodeToDelete = Head;
			Head = NodeToDelete->NextNode;
			delete NodeToDelete;
			// If the new head is a null ptr, so must the tail be
			if (!Head)
			{
				Tail = nullptr;
			}
		}
		else
		{
			// Else we iterate through the list
			Node* NodeBefore = Head;
			for (int NodeIndex = 0; NodeIndex < Index - 1; ++NodeIndex)
			{
				NodeBefore = NodeBefore->NextNode;
			}
			Node* NodeToDelete = NodeBefore->NextNode;
			NodeBefore->NextNode = NodeToDelete->NextNode;
			delete NodeToDelete;
		}
		--Length;
	}

	virtual bool Contains(T& Element) const override
	{
		Node* CurrNode = Head;
		while (CurrNode)
		{
			// Iterate through while the current node is real
			if (CurrNode->Item == Element)
			{
				return true;
			}
			CurrNode = CurrNode->NextNode;
		}
		return false;
	}

private:
	// Linked List YEAHHHHHHHHHHHHHH I LOVE COMPUTERS!!!!!!!!!!!!!!!!
	struct Node
	{
		T Item;
		Node* NextNode = nullptr;
	};

	int Length = 0;
	Node* Head = nullptr;
	Node* Tail = nullptr;
};